import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-facebook';
import { UserRepository } from '../../user/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { OauthResponseDto } from '../dto/oauth-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_OAUTH_SECRET'),
      callbackURL: `${configService.get('BASE_URL')}/auth/facebook/redirect`,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user: OauthResponseDto = {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      accessToken,
    };
    done(null, user);
  }
}
