import { AuthenticationService } from "./authentication.service";
import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Res,
  Body,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { Response } from "express";

import { AuthRegisterDto } from "./dto/auth-register.dto";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() body: AuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.usersService.findByEmailPassword(
      body.email,
      body.password,
    );
    if (!user) {
      throw new NotFoundException(
        "No user found with this email and password.",
      );
    }

    const result = this.authenticationService.createToken(user);
    return res.json(result);
  }

  @Post("register")
  async create(@Body() authRegisterDto: AuthRegisterDto) {
    const user = await this.usersService.create(authRegisterDto);
    const jwtData = this.authenticationService.createToken(user);
    return jwtData;
  }
}
