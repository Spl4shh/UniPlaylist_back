import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';
import { Public } from '../decorator/public.decorator';
import { UserDto } from '../dto/user.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthService } from '../service/auth.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService
  ) {}

  @Public()
  @Post()
  async register(@Body() user: Partial<User>): Promise<UserDto> {
    let createdUser = await this.userService.createUser(user);
   
    return new UserDto(createdUser);
  }

  @Public()
  @Post('/login')
  async login(@Body() credentials: LoginRequestDto) {
    return await this.authService.authenticateUser(credentials.login, credentials.password)
  }
}
