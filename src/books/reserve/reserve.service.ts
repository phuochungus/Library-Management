import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BusinessValidateService from 'src/business-validate/business-validate.service';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { RulesService } from 'src/rules/rules.service';
import { Repository } from 'typeorm';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    private busnessValidateService: BusinessValidateService,
    private rulesService: RulesService,
  ) {}

  async ReserveBook(userId: string, bookId: string) {
    let user = await this.usersRepository.findOneBy({ userId });
    let book = await this.booksRepository.findOne({
      where: { bookId },
      relations: { user: true },
    });
    if (user && book) {
      if (
        (await this.busnessValidateService.isUserAbleToMakeBorrowRequest(
          user,
        )) &&
        (this.busnessValidateService.isBookNotBorrowedAndNotReserved(book) ||
          this.busnessValidateService.isBookReserveForThisUser(userId, book))
      ) {
        const reserveDay = this.rulesService.getRule('RESERVE_DAY');
        if (!reserveDay)
          throw new HttpException('Error', HttpStatus.BAD_GATEWAY);

        const reserveDayValue = parseInt(reserveDay);

        let now = new Date();
        book.reservedDate = now;
        book.dueDate = new Date(now.getTime());
        book.dueDate.setDate(book.dueDate.getDate() + reserveDayValue);
        book.user = user;

        return await this.booksRepository.save(book);
      } else
        throw new HttpException(
          'Transaction is not valid',
          HttpStatus.CONFLICT,
        );
    } else throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async cancelReserve(userId: string, bookId: string) {
    let book = await this.booksRepository.findOne({
      where: { bookId },
      relations: { user: true },
    });

    if (!book) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    if (this.busnessValidateService.isBookReserveForThisUser(userId, book)) {
      book.user = null;
      book.dueDate = null;
      book.reservedDate = null;
      await this.booksRepository.save(book);
    }
  }
}
