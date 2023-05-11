import {
  IsMongoId,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;

  @IsNumber()
  @Min(1000)
  @Max(3000)
  publishYear: number;

  @IsNumber()
  @Min(1000)
  price: number;

  @IsUUID('4', { each: true })
  genreIds: string[];
}
