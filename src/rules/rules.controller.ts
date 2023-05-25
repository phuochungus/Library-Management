import { Controller } from '@nestjs/common';
import { Body, Get, Patch, UseGuards } from '@nestjs/common/decorators';
import UpdateRuleDto from './dto/update-rule.dto';
import { RulesService } from './rules.service';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { RolesGuard } from 'src/auth/authorization/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @Roles(Role.Admin)
  @Patch('/min_age')
  async updateMinAge(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('MINIMUM_AGE', updateRuleDto.value);
  }

  @Roles(Role.Admin)
  @Patch('/max_age')
  async updateMaxAge(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('MAXIMUM_AGE', updateRuleDto.value);
  }

  @Roles(Role.Admin)
  @Patch('/max_publish_year')
  async updateMaximumPublishYearSince(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule(
      'MAXIMUM_PUBLISH_YEAR_SINCE',
      updateRuleDto.value,
    );
  }

  @Roles(Role.Admin)
  @Patch('/max_borrow')
  async updateBorrowMax(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('BORROW_MAX', updateRuleDto.value);
  }

  @Roles(Role.Admin)
  @Patch('/fine_per_day')
  async updateFinePerDay(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('FINE_PER_DAY', updateRuleDto.value);
  }

  @Roles(Role.Admin)
  @Patch('/valid_period_of_user')
  async updateValidPeriodByDayOfUserAccount(
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    await this.rulesService.updateRule(
      'VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT',
      updateRuleDto.value,
    );
  }

  @Roles(Role.Admin)
  @Patch('/due_by_days')
  async updateDueByDaysOfBorrow(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('DUE_BY_DAYS', updateRuleDto.value);
  }

  @Roles(Role.User)
  @Get('/reserve_day')
  async getReserveDay() {
    return this.rulesService.getRule('RESERVE_DAY');
  }
}
