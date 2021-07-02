import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/default';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    UserModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {
}
