import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch, Put, ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoTextDto } from './dto/update-todo-text.dto';
import { Todo } from './entities/todo.entity';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { TodoFromDraftDto } from './dto/todo-from-draft.dto';
import { CompleteTodoDto } from './dto/complete-todo.dto';

@Controller('todo')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private readonly todoService: TodoService) {
  }

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.create(user, createTodoDto);
  }

  @Post(':id/todoFromDraft')
  todoFromDraft(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() todoFromDraftDto: TodoFromDraftDto,
  ) {
    return this.todoService.todoFromDraft(id, user, todoFromDraftDto);
  }

  @Post(':id/draftFromTodo')
  draftFromTodo(@Param('id') id: string, @GetUser() user: User) {
    return this.todoService.draftFromTodo(id, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Todo[]> {
    return this.todoService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.todoService.findOne(id, user);
  }

  @Patch(':id/complete')
  updateCompletion(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() completeTodoDto: CompleteTodoDto,
  ) {
    return this.todoService.complete(id, user, completeTodoDto);
  }

  @Patch(':id/text')
  updateText(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateTodoTextDto: UpdateTodoTextDto,
  ) {
    return this.todoService.updateText(id, user, updateTodoTextDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.todoService.remove(id, user);
  }

  @Put(':id/changePlan')
  changePlan(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body('date') date: string,
    @Body('order', ParseIntPipe) order: number,
  ) {
    return this.todoService.changeTodoPlan(id, user, order, date);
  }
}
