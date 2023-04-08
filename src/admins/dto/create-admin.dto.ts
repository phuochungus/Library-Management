import { IsDateString, IsEmail, IsString } from 'class-validator';

export default class CreateAdminDto {
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
}
