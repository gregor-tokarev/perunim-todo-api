import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/repositories/user.repository';
import { OauthResponseDto } from '../dto/oauth-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_SECRET'),
      callbackURL: `${configService.get<string>('BASE_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: OauthResponseDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
