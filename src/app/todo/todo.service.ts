import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoTextDto } from './dto/update-todo-text.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoRepository } from './repositories/todo.repository';
import { Todo } from './entities/todo.entity';
import { User } from '../user/entities/user.entity';
import { TodoFromDraftDto } from './dto/todo-from-draft.dto';
import { CompleteTodoDto } from './dto/complete-todo.dto';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository)
    private todoRepository: TodoRepository,
  ) {
  }

  async create(user: User, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new Todo();
    todo.text = createTodoDto.text;
    todo.user = user;
    todo.isDraft = true;
    todo.completed = false;

    const savedTodo = await todo.save();
    delete savedTodo.user;
    return savedTodo;
  }

  async todoFromDraft(
    id: string,
    user: User,
    todoFromDraftDto: TodoFromDraftDto,
  ): Promise<Todo> {
    const todo = await this.checkUserOwnTodo(id, user);
    if (!todo.isDraft) {
      throw new BadRequestException('This object is already todo');
    }
    todo.isDraft = false;
    todo.date = todoFromDraftDto.date;
    todo.order = todoFromDraftDto.order;

    const savedTodo = await todo.save();
    await this.operationWithOrder(id, user, 'increment');
    return savedTodo;
  }

  async draftFromTodo(id: string, user: User): Promise<Todo> {
    const todo = await this.checkUserOwnTodo(id, user);
    if (todo.isDraft) {
      throw new BadRequestException('This object is already draft');
    }
    todo.isDraft = true;
    todo.order = null;
    todo.date = null;

    await this.operationWithOrder(id, user, 'decrement');
    const savedTodo = await todo.save();
    return savedTodo;
  }

  async findAll(user: User): Promise<Todo[]> {
    const all = await this.todoRepository.find({ user });
    return all;
  }

  async findOne(id: string, user: User): Promise<Todo> {
    const todo = await this.checkUserOwnTodo(id, user);
    return todo;
  }

  async complete(
    id: string,
    user: User,
    completeTodoDto: CompleteTodoDto,
  ): Promise<Todo> {
    const todo = await this.checkUserOwnTodo(id, user);
    todo.changeCompletion(completeTodoDto.completion);
    const savedTodo = await todo.save();

    return savedTodo;
  }

  async updateText(
    id: string,
    user: User,
    updateTodoTextDto: UpdateTodoTextDto,
  ): Promise<Todo> {
    const todo = await this.checkUserOwnTodo(id, user);
    todo.text = updateTodoTextDto.text;
    const savedTodo = await todo.save();

    return savedTodo;
  }

  async remove(id: string, user: User) {
    await this.checkUserOwnTodo(id, user);
    await this.operationWithOrder(id, user, 'decrement');
    await this.todoRepository.delete(id);
  }

  private async checkUserOwnTodo(id: string, user: User): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ id, user });
    if (!todo) {
      throw new NotFoundException();
    }

    return todo;
  }

  private async operationWithOrder(
    id: string,
    user: User,
    operationType: 'increment' | 'decrement',
    orderOptions: {
      orderDirection: 'up' | 'down';
      stopOrder?: number;
    } = { orderDirection: 'up', stopOrder: undefined },
  ) {
    const todo = await this.checkUserOwnTodo(id, user);
    const date = todo.date;
    const order = todo.order;
    const selectedOrderTodosRunner = this.todoRepository
      .createQueryBuilder('todo')
      .where({
        id: Not(todo.id),
        user,
        date,
        order:
          orderOptions.orderDirection === 'up'
            ? MoreThanOrEqual(order)
            : LessThanOrEqual(order),
      });
    if (orderOptions.stopOrder) {
      selectedOrderTodosRunner.andWhere(
        `todo.order ${
          orderOptions.orderDirection === 'up' ? '<' : '>'
        } :order `,
        { order: orderOptions.stopOrder },
      );
    }
    const selectedOrderTodos = await selectedOrderTodosRunner.getMany();

    const operationsArr = selectedOrderTodos.map((todo: Todo) => {
      if (operationType === 'increment') {
        todo.order += 1;
      } else if (operationType === 'decrement') {
        todo.order -= 1;
      }
      return todo.save();
    });
    return Promise.all(operationsArr);
  }

  async changeTodoPlan(
    id: string,
    user: User,
    order: number,
    newDate: string,
  ): Promise<Todo> {
    const todo = await this.checkUserOwnTodo(id, user);
    const oldOrder = todo.order;
    const dateChanged = newDate !== todo.date;
    const orderIncremented = order > todo.order;

    todo.order = order;
    todo.date = newDate;

    if (dateChanged) {
      await this.operationWithOrder(id, user, 'decrement');

      const savedTodo = await todo.save();
      await this.operationWithOrder(id, user, 'increment');
      return savedTodo;
    } else if (orderIncremented) {
      const savedTodo = await todo.save();
      await this.operationWithOrder(id, user, 'decrement', {
        orderDirection: 'down',
        stopOrder: oldOrder - 1,
      });
      return savedTodo;
    } else {
      const savedTodo = await todo.save();
      await this.operationWithOrder(id, user, 'increment', {
        orderDirection: 'up',
        stopOrder: oldOrder + 1,
      });
      return savedTodo;
    }
  }
}
