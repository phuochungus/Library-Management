import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { stringify } from 'querystring';
import { Any } from 'typeorm';

@Injectable()
export default class ParseDateStringPipe
  implements PipeTransform<string, Date>
{
  transform(value: string, metadata: ArgumentMetadata): Date {
    if (Date.parse(value)) return new Date(value);
    throw new BadRequestException(
      'Validation failed (createdAt must be date-string)',
    );
  }
}
