import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
  }

  async updateAvatarFromGoogle(userId: string): Promise<string> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException("User doesn't exists");
    } else if (user.authMethod !== 'google') {
      throw new BadRequestException(
        'This routes can be used only by users with google auth',
      );
    }
    const googleInfo = await this.fetchGoogleInfo(user.googleAccessToken);

    user.avatar = googleInfo.picture;
    await user.save();

    return 'ok';
  }

  async fetchGoogleInfo(accessToken: string) {
    const info = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return info.data;
  }
}
