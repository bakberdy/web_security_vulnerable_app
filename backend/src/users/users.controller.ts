import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from '../auth/models/user.entity';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';

interface CurrentUserData {
  id: number;
  email: string;
  role: string;
}

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserData): Promise<UserEntity> {
    return this.usersService.getUserById(user.id);
  }

  @Get(':id')
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    return this.usersService.getUserProfile(id);
  }
}
