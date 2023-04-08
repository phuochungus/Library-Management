import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export default class UpdateBookGenresDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genreNames: string[];
}
