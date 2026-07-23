export class LoginResponseDto {
      // JWT
      token!: string;

      constructor(token: string) {
            this.token = token;
      }
}