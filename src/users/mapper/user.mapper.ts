import { User } from "../entity/user.entity";
import { UserWithFavouriteCatsDto } from "../dto/user-with-favourite-cats.dto";
import { instanceToPlain } from "class-transformer";

export const mapUserToDto = (user: User): UserWithFavouriteCatsDto => {
  const { __favouriteCats__, email, id } = instanceToPlain(user);

  return { favouriteCats: __favouriteCats__, id, email };
};
