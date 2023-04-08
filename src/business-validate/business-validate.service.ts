import { Injectable } from '@nestjs/common';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { RulesService } from 'src/rules/rules.service';

@Injectable()
export default class BusinessValidateService {
  constructor(private rulesListenerService: RulesService) {}

  async IsUserAbleToMakeBorrowRequest(user: User): Promise<boolean> {
    if (!user) return false;
    const userBooks = await user.books;

    if (
      this.isUserAgeValid(user.birth) &&
      !this.isUserReachBorrowLimit(userBooks.length) &&
      this.isUserAccountValid(user.validUntil) &&
      this.isUserNotPassDueAnyBook(userBooks)
    )
      return true;
    else return false;
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
    return false;
  }

  isUserReachBorrowLimit(numberOfBook: number): boolean {
    const borrowMaxValue = this.rulesListenerService.getRule('BORROW_MAX');
    if (!borrowMaxValue) return false;
    return numberOfBook >= parseInt(borrowMaxValue);
  }

  isUserAccountValid(validUntil: Date): boolean {
    return validUntil.getTime() > Date.now();
  }

  isBookAvailable(book: Book, userId: string): boolean {
    if (!book) return false;

    if (
      (this.isBookNotBorrowedAndNotReserved(book) ||
        this.isBookReserveForThisUser(userId, book)) &&
      this.isBookPublicationYearValid(book.publishYear)
    )
      return true;
    else return false;
  }

  static isBookReserved(book: Book): boolean {
    return (
      book.borrowedDate == null &&
      book.dueDate != null &&
      book.dueDate.getTime() > new Date().getTime()
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
    if (!MaximunPublicationYearSinceValue) return false;

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
