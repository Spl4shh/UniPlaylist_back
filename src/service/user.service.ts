import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.model';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly ALGO_CRYPTO = 'sha512'
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { login } });
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

  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, this.ALGO_CRYPTO).toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, stored: string): boolean {
    const parts = stored.split(':');
    if (parts.length !== 2) return false;

    const [salt, hash] = parts;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, this.ALGO_CRYPTO).toString('hex');

    return hash === verifyHash;
  }
}
