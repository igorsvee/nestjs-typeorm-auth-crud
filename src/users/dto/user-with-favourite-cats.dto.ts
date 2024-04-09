import { Cat } from "../../cats/entity/cat.entity";

export class UserWithFavouriteCatsDto {
  id: number;

  email: string;

  favouriteCats: Cat[];
}
