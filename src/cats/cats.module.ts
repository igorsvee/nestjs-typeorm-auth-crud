import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "./entity/cat.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Cat]), UsersModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
