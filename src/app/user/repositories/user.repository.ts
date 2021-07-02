import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthMethod } from '../interfaces/auth-method.interface';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(
    private configService: ConfigService,
  ) {
    super();
  }

  async createUser(
    createUserDto: CreateUserDto,
    authMethod: AuthMethod,
  ): Promise<User> {
    const user = new User();

    user.email = createUserDto.email;
    user.authMethod = authMethod.type;
    if (authMethod.type === 'email') {
      const hashedPassword = await hash(
        createUserDto.password,
        this.configService.get('JWT_SECRET'),
      );
      user.password = hashedPassword;
      user.setDefaultAvatar();
    } else if (authMethod.type === 'google') {
      user.googleAccessToken = authMethod.googleAccessToken;
      user.avatar = createUserDto.avatar;
    } else if (authMethod.type === 'facebook') {
      user.facebookAccessToken = authMethod.facebookAccessToken;
      user.setDefaultAvatar();
    }

    try {
      const newUser = await user.save();
      return newUser;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email has already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
