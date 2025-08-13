import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UsersService } from '../../users/users.service';

@Controller('api/v2/users')
export class UsersV2Controller {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: any,
    @Body() dto: { name: string; email: string }
  ) {
    const userId = Number(req.user?.sub ?? req.user?.userId);
    return this.users.updateProfile(userId, { name: dto.name, email: dto.email });
  }
}


