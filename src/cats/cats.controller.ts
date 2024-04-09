import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response, Request } from "express";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { Cat } from "./entity/cat.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/guards/public.guard";
import { JwtPayloadType } from "../auth/interfaces/jwt-payload.interface";
import { UserWithFavouriteCatsDto } from "../users/dto/user-with-favourite-cats.dto";
import { UserRole } from "../users/enums/user-role.enum";

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  async create(@Body() createCatDto: CreateCatDto) {
    return await this.catsService.create(createCatDto);
  }

  @Get()
  @Public()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(":id")
  @Public()
  async findOne(
    @Param("id", new ParseIntPipe())
    id: number,
  ) {
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new HttpException("cat not found", 404);
    }

    return cat;
  }

  @Put(":id")
  @Roles([UserRole.ADMIN])
  /*
  returns 201 if a new entity was created as per RFC https://www.rfc-editor.org/rfc/rfc9110#name-put, otherwise returns 200
   */
  async update(
    @Param("id", new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
    @Res() res: Response,
  ) {
    const isNewRecord = await this.catsService.updateOrCreate(id, updateCatDto);
    if (isNewRecord) {
      return res.status(HttpStatus.CREATED).send();
    }

    return res.status(HttpStatus.OK).send();
  }

  @Delete(":id")
  @Roles([UserRole.ADMIN])
  async delete(@Param("id", new ParseIntPipe()) id: number) {
    await this.catsService.delete(id);
  }

  @Post(":id/favourite")
  @Roles([UserRole.USER, UserRole.ADMIN])
  async setFavouriteCat(
    @Req() req: Request,
    @Param("id", new ParseIntPipe()) catId: number,
    @Res() res: Response,
  ): Promise<UserWithFavouriteCatsDto> {
    const userJwt = req.user as JwtPayloadType;

    const { userDto, isNewFavouriteCat } =
      await this.catsService.setFavouriteCatForUser(catId, userJwt.id);

    if (isNewFavouriteCat) {
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.OK);
    }

    return res.send(userDto) as unknown as UserWithFavouriteCatsDto;
  }
}
