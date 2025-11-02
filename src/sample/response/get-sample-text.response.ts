import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetSampleTextResponse {
  @Expose()
  @ApiProperty({
    type: String,
  })
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}
