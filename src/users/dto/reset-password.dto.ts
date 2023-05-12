import { IsEmail, IsString } from 'class-validator';

export default class ResetPasswordDTO {
  @IsEmail()
  email: string;

  @IsString()
  username: string;
}
