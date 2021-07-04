import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: TypeormConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TodoModule,
  ],
})
export class AppModule {}
