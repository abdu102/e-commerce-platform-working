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
    @Body() dto: { name?: string; email?: string }
  ) {
    const raw = req.user?.sub ?? req.user?.userId;
    const userId: number = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    return this.users.updateProfile(userId, { name: dto?.name, email: dto?.email });
  }
}



