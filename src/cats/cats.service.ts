import { Injectable } from "@nestjs/common";

import { Repository } from "typeorm";
import { Cat } from "./entity/cat.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { UsersService } from "../users/users.service";
import { UserWithFavouriteCatsDto } from "../users/dto/user-with-favourite-cats.dto";
import { mapUserToDto } from "../users/mapper/user.mapper";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    private readonly userService: UsersService,
  ) {}

  findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  findOne(id: number): Promise<Cat | null> {
    return this.catRepository.findOneBy({ id });
  }

  async delete(id: number) {
    return await this.catRepository.delete(id);
  }

  async create(createUserDto: CreateCatDto): Promise<Cat> {
    const cat = this.catRepository.create(createUserDto);
    return this.catRepository.save(cat);
  }

  /**
   * Upsert operation, returns true if inserted a new row,
   * and false in case of regular update
   * todo maybe use upsert method instead?
   */
  async updateOrCreate(
    id: number,
    updateCatDto: UpdateCatDto,
  ): Promise<boolean> {
    let catInDb = await this.catRepository.findOneBy({ id });

    if (!catInDb) {
      //  create a new record
      const cat = this.catRepository.create({ ...updateCatDto, id });
      await this.catRepository.save(cat);

      return true;
    }

    // update the existing record
    catInDb = this.catRepository.merge(catInDb, updateCatDto);
    await this.catRepository.save(catInDb);

    return false;
  }

  async setFavouriteCatForUser(
    catId: number,
    userId: number,
  ): Promise<{
    userDto: UserWithFavouriteCatsDto;
    isNewFavouriteCat: boolean;
  }> {
    const user = await this.userService.findOne({ id: userId });
    const cats = await user.favouriteCats;
    const alreadyLikedCat = cats.some((cat) => cat.id === catId);
    if (!alreadyLikedCat) {
      const cat = await this.findOne(catId);
      user.favouriteCats = Promise.resolve([...cats, cat]);
      const resultUser = await this.userService.save(user);

      return { userDto: mapUserToDto(resultUser), isNewFavouriteCat: true };
    }

    return { userDto: mapUserToDto(user), isNewFavouriteCat: false };
  }
}
