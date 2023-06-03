import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserClass } from 'src/entities/User';

export default class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  birth: Date;

  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(UserClass)
  type: UserClass;
}
