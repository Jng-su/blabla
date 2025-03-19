import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninDto } from '../auth/dto/signin.dto';

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
    await this.userRepository.remove(user);
  }
}
