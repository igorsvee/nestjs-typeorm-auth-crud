import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../../users/enums/user-role.enum";

export class AuthRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
