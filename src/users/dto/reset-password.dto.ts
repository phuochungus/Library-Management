import { IsEmail } from 'class-validator';

export default class ResetPasswordDTO {
  @IsEmail()
  email: string;
}
