import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponse } from './interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Get('/refresh')
  refreshJwtToken() {

  }

  @Post('/signup')
  signupWithEmail(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.signupUserWithEmail(createUserDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req): Promise<AuthResponse> {
    return this.authService.authUserWithGoogle(req.user);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req) {
    return this.authService.authUserWithFacebook(req.user);
  }
}
