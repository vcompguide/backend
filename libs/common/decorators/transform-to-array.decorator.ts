import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function TransformToArray() {
  return Transform(({ value, key }) => {
    if (!isString(value)) {
      throw new BadRequestException(`${key} must be a string. Use comma to separate multiple values`);
    }

    return value.split(',').map((item) => item.trim());
  });
}
