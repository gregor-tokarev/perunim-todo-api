import { IsIn, IsNotEmpty } from 'class-validator';

export class CompleteTodoDto {
  @IsNotEmpty()
  @IsIn(['true', 'false'])
  completion: boolean;
}
