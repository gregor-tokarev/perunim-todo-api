import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoRepository } from './repositories/todo.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [AuthModule, TypeOrmModule.forFeature([TodoRepository])],
})
export class TodoModule {}
