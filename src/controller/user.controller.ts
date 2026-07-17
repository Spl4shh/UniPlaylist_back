import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';
import { Public } from '../decorator/public.decorator';
import { UserDto } from '../dto/user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async register(@Body() user: Partial<User>): Promise<User> {
    let createdUser = await this.userService.createUser(user);
   
    return new UserDto(createdUser);
  }
}
