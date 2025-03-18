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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password } = signupDto;

    // 이메일 중복 확인
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 유저 생성
    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;

    // 데이터베이스에 유저 저장
    await this.userService.create(newUser);

    return { message: 'User registered successfully' };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    // DB에서 유저 정보 조회
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // Redis에 저장 (이메일 기반 키)
    await this.redisService.set(`${user.email}`, accessToken, 18000);

    return { access_token: accessToken };
  }

  async validateJwt(token: string): Promise<{ id: string; email: string }> {
    const decoded = this.jwtService.decode(token); // JWT를 디코딩하여 페이로드를 추출
    const userId = decoded['id']; // `id` 추출
    const email = decoded['email']; // `email` 추출

    // Redis에서 토큰 확인
    const storedToken = await this.redisService.get(`jwt:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // id와 email을 포함하여 반환
    return { id: userId, email };
  }

  async signout(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required for signout');
    }

    await this.redisService.del(email);
  }
}
