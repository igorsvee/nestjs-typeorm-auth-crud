import * as crypto from "crypto";
import { Injectable } from "@nestjs/common";

import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

import { User } from "./entity/user.entity";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmailPassword(
    email: string,
    unencryptedPassword: string,
  ): Promise<User | null> {
    return await this.userRepository.findOneBy({
      email,
      password: crypto.createHmac("sha256", unencryptedPassword).digest("hex"),
    });
  }

  async findOne(
    options?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User | null> {
    return await this.userRepository.findOneBy(options);
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async save(user: User) {
    return await this.userRepository.save(user);
  }
}
