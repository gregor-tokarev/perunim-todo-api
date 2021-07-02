import {
  Controller,
  Patch,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Patch(':id/update/google-avatar')
  updateUserAvatar(@Param('id') id: string) {
    return this.userService.updateAvatarFromGoogle(id);
  }
}
