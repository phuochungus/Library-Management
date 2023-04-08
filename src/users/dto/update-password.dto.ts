import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdatePasswordDto {
  @IsString()
  username: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
