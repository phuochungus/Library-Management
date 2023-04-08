import { Test, TestingModule } from '@nestjs/testing';
import { FineReceiptsController } from './fine-receipts.controller';
import { FineReceiptsService } from './fine-receipts.service';

describe('FineReceiptsController', () => {
  let controller: FineReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FineReceiptsController],
      providers: [FineReceiptsService],
    }).compile();

    controller = module.get<FineReceiptsController>(FineReceiptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
