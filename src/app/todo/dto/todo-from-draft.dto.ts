import { IsDateString, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class TodoFromDraftDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  order: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
