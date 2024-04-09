import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayloadType } from "../interfaces/jwt-payload.interface";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /*
    if jwt.verify was successful then this method gets called,
    and it's return value becomes accessible via req.user later
     */
  public async validate(
    payload: object & JwtPayloadType,
  ): Promise<JwtPayloadType> {
    //  todo maybe hit the db to verify that user still exists
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
