import {
  IsDefined,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCatDto {
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsInt()
  readonly age: number;

  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  readonly breed: string;
}
