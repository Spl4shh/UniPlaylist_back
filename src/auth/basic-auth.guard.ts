import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../service/user.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
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

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Basic ', '');
    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const parts = credentials.split(':');

    if (parts.length < 2) {
      throw new UnauthorizedException('Invalid basic auth credentials format');
    }

    const login = parts[0];
    const password = parts.slice(1).join(':');

    const user = await this.userService.findOneByLogin(login);
    if (!user || !this.userService.verifyPassword(password, user.password!)) {
      throw new UnauthorizedException('Invalid login or password');
    }

    request.user = user;
    
    return true;
  }
}
