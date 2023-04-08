import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FineReceipt from 'src/entities/FineReceipt';
import User from 'src/entities/User';
import { MongoRepository, Repository } from 'typeorm';
import { CreateFineReceiptDto } from './dto/create-fine-receipt.dto';
import { use } from 'passport';

@Injectable()
export class FineReceiptsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(FineReceipt, 'mongoDB')
    private fineReceiptsRepository: MongoRepository<FineReceipt>,
  ) {}

  async create(createFineReceiptDto: CreateFineReceiptDto) {
    let user = await this.usersRepository.findOneBy({
      userId: createFineReceiptDto.userId,
    });

    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (user.totalDebt < createFineReceiptDto.pay) {
      throw new HttpException(
        'Pay can not larger than debt',
        HttpStatus.CONFLICT,
      );
    }

    const totalDebt = user.totalDebt;
    user.totalDebt -= createFineReceiptDto.pay;
    await this.usersRepository.save(user);
    return (
      await this.fineReceiptsRepository.insert({
        createdDate: new Date(),
        userId: createFineReceiptDto.userId,
        totalDebt: totalDebt,
        pay: createFineReceiptDto.pay,
        remain: user.totalDebt,
      })
    ).raw.ops;
  }

  async findAll() {
    return await this.fineReceiptsRepository.find();
  }

  async findOne(recepitId: string) {
    const receipt = await this.fineReceiptsRepository.findOneBy(recepitId);
    if (receipt) return receipt;
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async findAllFromUser(userId: string) {
    return await this.fineReceiptsRepository.find({
      where: { userId },
    });
  }
}
