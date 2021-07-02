import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeormConfig = (): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    port: 5432,
    synchronize: true,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
  };
  return config;
};
