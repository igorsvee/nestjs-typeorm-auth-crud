import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import { JwtPayloadType } from "../../auth/interfaces/jwt-payload.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    //todo don't rely on token & query the db for more recent user data
    const user = request.user as JwtPayloadType;
    const hasRole = () =>
      roles.some((role) => user.role.toLowerCase() === role.toLowerCase());

    return user && user.role && hasRole();
  }
}
