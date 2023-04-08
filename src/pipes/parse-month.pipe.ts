import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseMonthPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (1 <= value && value <= 12) return value;
    throw new BadRequestException(
      'Validation failed (month must between 1 and 12)',
    );
  }
}
