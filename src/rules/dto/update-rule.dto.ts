import { IsNumberString } from 'class-validator';

export default class UpdateRuleDto {
  @IsNumberString()
  value: string;
}
