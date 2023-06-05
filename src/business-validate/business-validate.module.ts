import { Module } from '@nestjs/common';
import { RulesModule } from 'src/rules/rules.module';
import { BusinessValidateService } from './business-validate.service';

@Module({
  imports: [RulesModule],
  providers: [BusinessValidateService],
  exports: [BusinessValidateService],
})
export class BusinessValidateModule {}
