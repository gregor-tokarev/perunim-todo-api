import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { TodoModule } from './app/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [TypeormConfig],
    }),
    TypeOrmModule.forRoot(TypeormConfig()),
    AuthModule,
    UserModule,
    TodoModule,
  ],
})
export class AppModule {
}
