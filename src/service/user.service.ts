import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.model';
import * as Jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  private readonly ALGO_CRYPTO = 'sha512'

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
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

  verifyPassword(passwordToVerify: string, stored: string): boolean {
    const parts = stored.split(':');
    if (parts.length !== 2) return false;

    const [salt, hash] = parts;
    const verifyHash = crypto.pbkdf2Sync(passwordToVerify, salt, 1000, 64, this.ALGO_CRYPTO).toString('hex');

    return hash === verifyHash;
  }

  async authenticateUser(login: string, password: string) {
    const user = await this.findOneByLogin(login);

    if (user && this.verifyPassword(password, user.password)) {
      const jwtSecretKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
      const userDto = new UserDto(user);

      const token = Jwt.sign({ user: userDto }, jwtSecretKey, { expiresIn: '1h' });
      
      return new LoginResponseDto(token);
    } else {
      throw new ForbiddenException('User unauthenticable')
    }
  }
}
