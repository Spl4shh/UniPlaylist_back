import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../service/user.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import * as Jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const jwtSecretKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
    Jwt.verify(token, jwtSecretKey, (err: any, decoded: any) => {
      if (err) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = decoded.user;
    });

    return true
  }
}
