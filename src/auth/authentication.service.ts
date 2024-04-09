import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entity/user.entity";
import { JwtPayloadType } from "./interfaces/jwt-payload.interface";
import * as crypto from "crypto";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  createToken(user: User) {
    const { email, id, role } = user;

    const userData: JwtPayloadType = { email, id, role };
    const token = this.jwtService.sign(userData);
    return {
      access_token: token,
      expires_in: process.env.JWT_TTL,
    };
  }

  async signIn(payload: { email: string; password: string }): Promise<any> {
    const user = await this.userService.findOne({ email: payload.email });

    if (
      user &&
      user.password ===
        crypto.createHmac("sha256", payload.password).digest("hex")
    ) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException();
  }
}
