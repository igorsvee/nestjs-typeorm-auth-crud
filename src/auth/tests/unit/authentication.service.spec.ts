import { Test } from "@nestjs/testing";
import { AuthenticationService } from "../../authentication.service";
import { UsersModule } from "../../../users/users.module";
import { User } from "../../../users/entity/user.entity";
import { UserRole } from "../../../users/enums/user-role.enum";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cat } from "../../../cats/entity/cat.entity";

import { DataSource } from "typeorm";

const getMemoryRootTypeormModule = () => {
  return TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as unknown as number,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [Cat, User],
  });
};

let dataSource: DataSource;
const initializeDatabase = async () => {
  dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as unknown as number,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [Cat, User],
    dropSchema: true,
    synchronize: true,
    // logging: true
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const admin: any = {};
  admin.email = "admin@gmail.com";
  admin.role = UserRole.ADMIN;
  admin.password = "123";

  const user: any = {};
  user.email = "user@gmail.com";
  user.role = UserRole.USER;
  user.password = "123";
  //

  const adminEntity = userRepository.create(admin);
  const userEntity = userRepository.create(user);

  //
  await userRepository.save(adminEntity);
  await userRepository.save(userEntity);
};

const clearDatabase = async () => {
  await dataSource.dropDatabase();
  await dataSource.destroy();
};

const logInAndGetTokenForUser = () => {
  console;
};

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService;

  beforeAll(() => {
    return initializeDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        getMemoryRootTypeormModule(),
        UsersModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_TTL },
        }),
      ],
      providers: [AuthenticationService],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it("should return a token", async () => {
    const user = new User();
    user.email = "test@gmail.com";
    user.role = UserRole.USER;
    user.id = 1;

    const result = authenticationService.createToken(user);

    expect(result).not.toBeNull();
    expect(result.access_token).not.toBeNull();

    expect(result.expires_in).toBe(process.env.JWT_TTL);
  });

  it("should validate the user", async () => {
    const result = await authenticationService.signIn({
      email: "user@gmail.com",
      password: "123",
    });

    expect(result).toBeTruthy();
  });
});
