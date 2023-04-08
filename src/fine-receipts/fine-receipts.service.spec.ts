import { Test, TestingModule } from '@nestjs/testing';
import { FineReceiptsService } from './fine-receipts.service';

describe('FineReceiptsService', () => {
  let service: FineReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FineReceiptsService],
    }).compile();

    service = module.get<FineReceiptsService>(FineReceiptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
