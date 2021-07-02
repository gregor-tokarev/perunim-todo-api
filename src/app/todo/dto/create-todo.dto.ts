import { IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  text: string;
}
