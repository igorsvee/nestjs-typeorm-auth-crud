import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
