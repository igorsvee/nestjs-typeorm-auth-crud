import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";
import { CoreModule } from "./core/core.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "./cats/entity/cat.entity";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entity/user.entity";
import { AuthenticationModule } from "./auth/authentication.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Cat, User],
      synchronize: true,
      logging: true,
    }),
    CoreModule,
    CatsModule,
    AuthenticationModule,
    UsersModule,
  ],
})
export class AppModule {}
