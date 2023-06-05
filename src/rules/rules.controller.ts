import { Controller, UseGuards, Patch, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/authentication/jwt-auth.guard';
import { Role } from '../auth/authorization/role.enum';
import { Roles } from '../auth/authorization/roles.decorator';
import { RolesGuard } from '../auth/authorization/roles.guard';
import UpdateRuleDto from './dto/update-rule.dto';
import { RulesService } from './rules.service';

@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/min_age')
  async updateMinAge(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('MINIMUM_AGE', updateRuleDto.value);
  }

  @Get('/min_age')
  getMinAge() {
    return this.rulesService.getRule('MINIMUM_AGE');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/max_age')
  async updateMaxAge(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('MAXIMUM_AGE', updateRuleDto.value);
  }

  @Get('/max_age')
  getMaxAge() {
    return this.rulesService.getRule('MAXIMUM_AGE');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/max_publish_year')
  async updateMaximumPublishYearSince(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule(
      'MAXIMUM_PUBLISH_YEAR_SINCE',
      updateRuleDto.value,
    );
  }

  @Get('/max_publish_year')
  getMaximumPublishYearSince() {
    return this.rulesService.getRule('MAXIMUM_PUBLISH_YEAR_SINCE');
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/max_borrow')
  async updateBorrowMax(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('BORROW_MAX', updateRuleDto.value);
  }

  @Get('/max_borrow')
  getBorrowMax() {
    return this.rulesService.getRule('BORROW_MAX');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/fine_per_day')
  async updateFinePerDay(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('FINE_PER_DAY', updateRuleDto.value);
  }

  @Get('/fine_per_day')
  getFinePerDay() {
    return this.rulesService.getRule('FINE_PER_DAY');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get('/fine_per_day')
  getValidPeriodByDayOfUserAccount() {
    return this.rulesService.getRule('VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/borrow_interval')
  async updateDueByDaysOfBorrow(@Body() updateRuleDto: UpdateRuleDto) {
    await this.rulesService.updateRule('BORROW_INTERVAL', updateRuleDto.value);
  }

  @Get('/borrow_interval')
  getDueByDaysOfBorrow() {
    return this.rulesService.getRule('BORROW_INTERVAL');
  }

  @Get('/reserve_day')
  async getReserveDay() {
    return this.rulesService.getRule('RESERVE_DAY');
  }
}
