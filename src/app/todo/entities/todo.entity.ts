import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

@Entity('todo')
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  completed: boolean;

  @Column({ nullable: true })
  order: number;

  @Column({ nullable: true })
  date: string;

  @Column()
  isDraft: boolean;

  @CreateDateColumn()
  created: string;

  @UpdateDateColumn()
  updated: string;

  @ManyToOne(_ => User, user => user.id)
  user: User;

  changeCompletion(completion: boolean) {
    if (this.isDraft) {
      throw new ForbiddenException('First transform draft to todo');
    }
    this.completed = completion;
  }
}
