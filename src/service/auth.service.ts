import { ForbiddenException, Injectable } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { LoginResponseDto } from '../dto/response/login-response.dto';
import { UserDto } from '../dto/user.dto';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
      private readonly jwtSecretKey: string;

      constructor(private readonly userService: UserService,
                  private readonly configService: ConfigService) {
            this.jwtSecretKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
      }

      verifyPassword(passwordToVerify: string, stored: string): boolean {
            const parts = stored.split(':');
            if (parts.length !== 2) return false;

            const [salt, hash] = parts;
            const verifyHash = crypto.pbkdf2Sync(passwordToVerify, salt, 1000, 64, this.configService.getOrThrow<string>('ALGO_CRYPTO')).toString('hex');

            return hash === verifyHash;
      }

      /**
       * Renvoi un token JWT si l'utilisateur est authentifié, sinon une exception est levée.
       * @param login 
       * @param password 
       * @returns Un token JWT
       */
      async authenticateUser(login: string, password: string): Promise<{accessToken: any, refreshToken: any}> {
            const user = await this.userService.findOneByLogin(login);

            if (user && this.verifyPassword(password, user.password)) {
                  const userDto = new UserDto(user);
                  const accessToken = this.generateAccessToken(userDto);
                  const refreshToken = this.generateRefreshToken();
                        
                  this.userService.updateRefreshToken(user.id, refreshToken);

                  return {accessToken, refreshToken};
            } else {
                  throw new ForbiddenException('User unauthenticable')
            }
      }

      async refreshUser(refreshToken: string, userId: number): Promise<{accessToken: any, refreshToken: any}> {
            if (parseInt(atob(refreshToken)) > Date.now()) {
                  const user = await this.userService.findOneById(userId);

                  if (user && user.refreshToken === refreshToken) {
                        const userDto = new UserDto(user);
                        const accessToken = this.generateAccessToken(userDto);
                        const refreshToken = this.generateRefreshToken();

                        this.userService.updateRefreshToken(user.id, refreshToken);

                        return {accessToken, refreshToken};
                  } else {
                        throw new ForbiddenException('User unauthenticable')
                  }
            } else {
                  throw new ForbiddenException('Token expired')
            }
            
      }

      private generateAccessToken(userDto: UserDto): string {
            return Jwt.sign({ user: userDto }, this.jwtSecretKey, { expiresIn: '1h' })
      }

      private generateRefreshToken(): string {
            const availabilityDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

            const limiteDateRefresh = new Date(Date.now() + availabilityDuration); 
            const refreshToken = btoa(limiteDateRefresh.getTime().toString());

            return refreshToken;
      }
}