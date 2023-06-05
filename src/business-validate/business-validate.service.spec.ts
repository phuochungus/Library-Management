import { Test, TestingModule } from '@nestjs/testing';
import { BusinessValidateService } from './business-validate.service';

describe('BusinessValidateService', () => {
  let service: BusinessValidateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessValidateService],
    }).compile();

    service = module.get<BusinessValidateService>(BusinessValidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
