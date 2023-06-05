import { Test, TestingModule } from '@nestjs/testing';
import { BusinessValidateService } from './business-validate.service';
import { RulesService } from '../rules/rules.service';
import { createMock } from '@golevelup/ts-jest';

describe('BusinessValidateService', () => {
  let service: BusinessValidateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessValidateService,
        { provide: RulesService, useValue: createMock<RulesService>() },
      ],
    }).compile();

    service = module.get<BusinessValidateService>(BusinessValidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('show give same first day from interval', () => {
    const MILISECOND_IN_ONE_DAY = 24 * 60 * 60 * 1000;

    for (let interval = 3; interval <= 3; ++interval) {
      let count = interval;
      let firstDayOfInterval: string = service
        .findFirstDayInInterval(0, interval)
        .toDateString();
      for (let i = 0; i < 1000; i++) {
        if (count) {
          count--;
        } else {
          firstDayOfInterval = service
            .findFirstDayInInterval(i * MILISECOND_IN_ONE_DAY + 1, interval)
            .toDateString();
        }
        expect(
          service
            .findFirstDayInInterval(i * MILISECOND_IN_ONE_DAY, interval)
            .toDateString(),
        ).toEqual(firstDayOfInterval);
      }
    }
  });
});
