import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTodoTextDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
