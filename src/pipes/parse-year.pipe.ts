import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseYearPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (1 <= value) return value;
    throw new BadRequestException(
      'Validation failed (year must greater than 0)',
    );
  }
}
