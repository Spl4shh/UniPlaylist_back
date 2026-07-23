import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.model';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { login } });
  }

  hashPassword(password: string): string {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, this.configService.getOrThrow<string>('ALGO_CRYPTO')).toString('hex');
      return `${salt}:${hash}`;
  }

  async createUser(userDto: Partial<User>): Promise<User> {
    if (!userDto.login || !userDto.password) {
      throw new Error('Login and password are required');
    }

    if (await this.findOneByLogin(userDto.login)) {
      throw new ConflictException(`User with login ${userDto.login} already exists.`);
    }

    const newUser = new User();
    newUser.login = userDto.login;
    newUser.password = this.hashPassword(userDto.password);

    return await this.userRepository.save(newUser);
  }
}
