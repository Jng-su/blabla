import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninDto } from '../auth/dto/signin.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(signupDto: SigninDto): Promise<User> {
    return this.userRepository.save(signupDto);
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.getUserById(userId);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'friends')
      .of(user)
      .remove(user.friends || []);
    await this.userRepository.remove(user);
  }

  async inviteFriend(userId: string, email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { email },
      relations: ['friends'],
    });

    if (!user || !friend)
      throw new NotFoundException('User or friend not found');
    if (user.id === friend.id)
      throw new NotFoundException('Cannot add yourself as a friend');
    if (user.friends.some((f) => f.id === friend.id)) {
      throw new NotFoundException('Already friends');
    }

    user.friends = user.friends || [];
    friend.friends = friend.friends || [];
    user.friends.push(friend);
    friend.friends.push(user);

    await this.userRepository.save([user, friend]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image,
      statusMessage: user.statusMessage,
      friends: user.friends.map((f) => f.id),
    };
  }

  async getFriends(userId: string): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.friends || [];
  }

  async removeFriend(
    userId: string,
    friendId: string,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
      relations: ['friends'],
    });

    if (!user || !friend)
      throw new NotFoundException('User or friend not found');
    if (!user.friends.some((f) => f.id === friend.id)) {
      throw new NotFoundException('Not friends with this user');
    }

    user.friends = user.friends.filter((f) => f.id !== friend.id);
    friend.friends = friend.friends.filter((f) => f.id !== user.id);
    await this.userRepository.save([user, friend]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image,
      statusMessage: user.statusMessage,
      friends: user.friends.map((f) => f.id),
    };
  }
}
