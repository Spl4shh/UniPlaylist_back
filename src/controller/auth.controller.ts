import { Controller, Post, Body } from "@nestjs/common";
import { Public } from "../decorator/public.decorator";
import { LoginRequestDto } from "../dto/request/login-request.dto";
import { AuthService } from "../service/auth.service";
import { LoginResponseDto } from "../dto/response/login-response.dto";
import { RefreshRequestDto } from "../dto/request/refresh-request.dto";

@Controller('/login')
export class AuthController {
      constructor(private readonly authService: AuthService) { }

      @Public()
      @Post()
      async login(@Body() credentials: LoginRequestDto): Promise<LoginResponseDto> {
            const {accessToken, refreshToken} = await this.authService.authenticateUser(credentials.login, credentials.password);

            return new LoginResponseDto(accessToken, refreshToken)
      }

      @Public()
      @Post("refresh")
      async refresh(@Body() refreshRequestDto: RefreshRequestDto): Promise<LoginResponseDto> {
            const {accessToken, refreshToken} = await this.authService.refreshUser(refreshRequestDto.refreshToken, refreshRequestDto.userId);

            return new LoginResponseDto(accessToken, refreshToken)
      }
}
