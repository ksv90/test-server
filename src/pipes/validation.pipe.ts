import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationException } from '../exceptions';

export class ValidationPipe implements PipeTransform {
  async transform<TData, TDto extends object>(data: TData, metadata: ArgumentMetadata) {
    if (!metadata.metatype) return data;
    const dto = plainToClass<TDto, TData>(metadata.metatype, data);
    const errors = await validate(dto);
    if (!errors.length) return data;
    const messages = errors.map((error) => {
      const text = !error.constraints ? 'unknown error' : Object.values(error.constraints).join('; ');
      return `${error.property} - ${text}`;
    });
    throw new ValidationException(messages);
  }
}
