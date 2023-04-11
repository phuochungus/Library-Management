import {
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

  @IsDateString()
  birth: Date;

  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(UserClass)
  type: UserClass;
}
