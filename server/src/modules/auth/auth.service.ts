import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { User } from '../user/entites/user.entity';
import { SigninDto } from './dto/signin.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password, role } = signupDto;
    const existingUser = await this.userService.checkUserExistsByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = role ? role : 'user';
    await this.userService.createUser(newUser);
    return { message: 'User registered successfully' };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '5h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const accessTokenTTL = 5 * 60 * 60;
    const refreshTokenTTL = 7 * 24 * 60 * 60;
    await this.redisService.set(
      email,
      accessToken,
      refreshToken,
      accessTokenTTL,
      refreshTokenTTL,
    );
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const decoded = this.jwtService.decode(refreshToken) as JwtPayload;
    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const storedRefreshToken = await this.redisService.get(
      `refresh_token:${decoded.email}`,
    );
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const accessToken = this.jwtService.sign(
      { id: decoded.id, email: decoded.email, name: decoded.name },
      { expiresIn: '5h' },
    );
    return { access_token: accessToken };
  }

  async validateJwt(token: string): Promise<JwtPayload> {
    const decoded = this.jwtService.decode(token);
    const userId = decoded['id'];
    const name = decoded['name'];
    const email = decoded['email'];
    const role = decoded['role'];
    const storedAccessToken = await this.redisService.get(
      `access_token:${email}`,
    );
    if (!storedAccessToken || storedAccessToken !== token) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return { id: userId, name, email, role };
  }

  async signout(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required for signout');
    }
    const accessKey = `access_token:${email}`;
    const refreshKey = `refresh_token:${email}`;
    await this.redisService.del(accessKey);
    await this.redisService.del(refreshKey);
    return { message: 'Signout successful' };
  }

  async deleteAccount(userId: string) {
    await this.chatService.deleteUserFromAllChats(userId);
    await this.userService.deleteUser(userId);
    return { message: 'Account deleted successfully' };
  }
}
