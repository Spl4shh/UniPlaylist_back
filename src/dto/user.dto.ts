import { User } from "../model/user.model";

export class UserDto {
      id!: number;
      login!: string

      constructor(user: User) {
            this.id = user.id;
            this.login = user.login;
      }
}