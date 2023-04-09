import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export default class QueryBookDTO {
  @IsOptional()
  @IsString()
  keywords: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  genre: string;

  @IsOptional()
  @IsNumberString()
  page: string;

  @IsString()
  @IsOptional()
  status: string;
}
