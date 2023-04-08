import { Controller } from '@nestjs/common';
import { Body, Patch } from '@nestjs/common/decorators';
import UpdateRuleDto from './dto/update-rule.dto';
import { RulesService } from './rules.service';

@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @Patch('/min_age')
  async updateMinAge(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('MINIMUM_AGE', updateRuleDto.value);
  }

  @Patch('/max_age')
  async updateMaxAge(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('MAXIMUM_AGE', updateRuleDto.value);
  }

  @Patch('/max_publish_year')
  async updateMaximumPublishYearSince(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule(
      'MAXIMUM_PUBLISH_YEAR_SINCE',
      updateRuleDto.value,
    );
  }

  @Patch('/max_borrow')
  async updateBorrowMax(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('BORROW_MAX', updateRuleDto.value);
  }

  @Patch('/fine_per_day')
  async updateFinePerDay(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('FINE_PER_DAY', updateRuleDto.value);
  }

  @Patch('/valid_period_of_user')
  async updateValidPeriodByDayOfUserAccount(
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    await this.rulesService.updateRule(
      'VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT',
      updateRuleDto.value,
    );
  }
}
