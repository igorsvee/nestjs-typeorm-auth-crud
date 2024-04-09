import { UserRole } from "../../users/enums/user-role.enum";

export interface JwtPayloadType {
  email: string;
  id: number;
  role: UserRole;
}
