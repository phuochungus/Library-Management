import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Book from '../entities/Book';
import User from '../entities/User';
import { RulesService } from '../rules/rules.service';
import { isInt } from 'class-validator';

@Injectable()
export class BusinessValidateService {
  constructor(private rulesListenerService: RulesService) {}

  async isUserAbleToMakeBorrowRequest(user: User): Promise<boolean> {
    if (!user) return false;
    const userBooks = await user.books;

    if (!this.isUserAgeValid(user.birth))
      throw new ConflictException('User age not supported');

    if (this.isUserReachBorrowLimit(userBooks))
      throw new ConflictException(
        'User reach borrow limit within this interval of time, try again later',
      );

    if (!this.isUserAccountValid(user.validUntil))
      throw new ConflictException('User account is expired');

    if (!this.isUserNotPassDueAnyBook(userBooks))
      throw new ConflictException('User has pass due book');
    return true;
  }

  isUserNotPassDueAnyBook(books: Book[]): boolean {
    for (let book of books) {
      if (book.dueDate!.getTime() < Date.now()) return false;
    }
    return true;
  }

  isUserAgeValid(birth: Date): boolean {
    const YEAR_IN_MILISECOND = 1000 * 3600 * 24 * 365.25;
    const timeDiff = Math.abs(Date.now() - birth.getTime());
    const age = Math.floor(timeDiff / YEAR_IN_MILISECOND);
    let minAgeValues = this.rulesListenerService.getRule('MINIMUM_AGE');
    let maxAgeValues = this.rulesListenerService.getRule('MAXIMUM_AGE');
    if (minAgeValues && maxAgeValues)
      return parseInt(minAgeValues) <= age && age <= parseInt(maxAgeValues);
    throw new HttpException('Bad gatewat', HttpStatus.BAD_GATEWAY);
  }

  isUserReachBorrowLimit(
    books: Book[],
    numberOfBookAboutTobeBorrow = 0,
  ): boolean {
    const borrowMaxValue = this.rulesListenerService.getRule('BORROW_MAX');
    const borrowDueValue = this.rulesListenerService.getRule('BORROW_INTERVAL');
    if (borrowMaxValue && borrowDueValue) {
      const borrowMax = parseInt(borrowMaxValue);
      const borrowInterval = parseInt(borrowDueValue);
      let count = numberOfBookAboutTobeBorrow;
      const firstDayOfInterval = this.findFirstDayInInterval(
        Date.now(),
        borrowInterval,
      );

      for (let book of books) {
        let date = book.borrowedDate || book.reservedDate;
        if (date!.getTime() > firstDayOfInterval.getTime()) count++;
      }
      return count >= borrowMax;
    } else throw new HttpException('Bad gatewat', HttpStatus.BAD_GATEWAY);
  }

  findFirstDayInInterval(
    anyDayFromIntervalInMilisec: number,
    interval: number,
  ) {
    if (!isInt(interval))
      throw new ConflictException('Interval must be integer');
    const MILISECOND_IN_ONE_DAY = 24 * 60 * 60 * 1000;
    const MILISECOND_IN_INTERVAL = interval * MILISECOND_IN_ONE_DAY;
    const milisecPassedInInterval =
      anyDayFromIntervalInMilisec % MILISECOND_IN_INTERVAL;
    return new Date(anyDayFromIntervalInMilisec - milisecPassedInInterval);
  }

  isUserAccountValid(validUntil: Date): boolean {
    return validUntil.getTime() > Date.now();
  }

  isBookAvailable(book: Book) {
    if (!book) return false;
    if (
      this.isBookNotBorrowedAndNotReserved(book) &&
      this.isBookPublicationYearValid(book.publishYear)
    )
      return true;
    return false;
  }

  isBookAvailableForUser(book: Book, userId: string): boolean {
    if (!book) return false;
    if (
      !(
        this.isBookNotBorrowedAndNotReserved(book) ||
        this.isBookReserveForThisUser(userId, book)
      )
    )
      throw new ConflictException('Book not available for user');

    if (!this.isBookPublicationYearValid(book.publishYear))
      throw new ConflictException(
        'Book publication year too old, can not borrow such old book for presevation policy',
      );
    return true;
  }

  static isBookReserved(book: Book): boolean {
    return (
      book.borrowedDate == null &&
      book.reservedDate != null &&
      book.dueDate != null &&
      book.dueDate.getTime() > Date.now()
    );
  }

  isBookNotBorrowedAndNotReserved(book: Book): boolean {
    return (
      book.borrowedDate == null && !BusinessValidateService.isBookReserved(book)
    );
  }

  isBookReserveForThisUser(userId: string, book: Book) {
    return (
      book.user?.userId === userId &&
      BusinessValidateService.isBookReserved(book)
    );
  }

  isBookPublicationYearValid(year: number): boolean {
    const MaximunPublicationYearSinceValue = this.rulesListenerService.getRule(
      'MAXIMUM_PUBLISH_YEAR_SINCE',
    );
    if (!MaximunPublicationYearSinceValue)
      throw new HttpException('Bad gatewat', HttpStatus.BAD_GATEWAY);
    if (
      new Date().getFullYear() - year <=
      parseInt(MaximunPublicationYearSinceValue)
    )
      return true;
    else return false;
  }

  isBookBorrowedByUser(book: Book, user: User): boolean {
    return book.user?.userId == user.userId;
  }
}
