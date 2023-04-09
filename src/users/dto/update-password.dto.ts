import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdatePasswordDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  newPassword: string;
}
