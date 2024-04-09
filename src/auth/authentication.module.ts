import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import JwtStrategy from "./passports/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";

import * as dotenv from "dotenv";

dotenv.config(); //  make env variables available in the decorator below

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TTL },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
