import { ForbiddenException, Injectable } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserDto } from '../dto/user.dto';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

      constructor(private readonly userService: UserService,
                  private readonly configService: ConfigService) {}

      verifyPassword(passwordToVerify: string, stored: string): boolean {
            const parts = stored.split(':');
            if (parts.length !== 2) return false;

            const [salt, hash] = parts;
            const verifyHash = crypto.pbkdf2Sync(passwordToVerify, salt, 1000, 64, this.configService.getOrThrow<string>('ALGO_CRYPTO')).toString('hex');

            return hash === verifyHash;
      }

      async authenticateUser(login: string, password: string): Promise<LoginResponseDto> {
            const user = await this.userService.findOneByLogin(login);

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