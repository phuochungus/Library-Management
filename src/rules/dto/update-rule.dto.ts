import { IsNotEmpty, IsNumberString } from 'class-validator';

export default class UpdateRuleDto {
  @IsNotEmpty()
  @IsNumberString()
  value: string;
}
