import { Controller, Get, Patch, Body, UseGuards, Request, Param, ParseIntPipe, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
  async list(@Query('role') role?: string) {
    return this.usersService.list(role as any);
  }

  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() data: { name: string; email: string }) {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  @Patch('password')
  async changePassword(@Request() req: any, @Body() data: { currentPassword: string; newPassword: string }) {
    return this.usersService.changePassword(req.user.userId, data);
  }

  @Patch(':id/role')
  @Roles('SUPER_ADMIN')
  async updateRole(@Body() data: { role: string }, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.updateRole(id, data.role);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}


