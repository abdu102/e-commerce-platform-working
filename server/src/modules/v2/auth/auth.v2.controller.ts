import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LoginDto, RegisterDto, RefreshDto } from '../dto/v2.dto';
import { UsersService } from '../../users/users.service';

@Controller('api/v2/auth')
export class AuthV2Controller {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { user, token } = await this.auth.login(dto);
    return { tokens: { accessToken: token, refreshToken: token }, user };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { user, token } = await this.auth.register({ name: dto.name || "", email: dto.email, password: dto.password });
    return { tokens: { accessToken: token, refreshToken: token }, user };
  }

  @Post('refresh')
  async refresh(@Body() _dto: RefreshDto) {
    // For now, use the same token as both access and refresh
    // In future, wire a real refresh token flow
    return { accessToken: _dto.refreshToken, refreshToken: _dto.refreshToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const raw = req.user?.sub ?? req.user?.userId;
    const userId: number = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    return this.auth.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async changePassword(@Req() req: any, @Body() dto: { currentPassword: string; newPassword: string }) {
    const raw = req.user?.sub ?? req.user?.userId;
    const userId: number = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    return this.users.changePassword(userId, { currentPassword: dto.currentPassword, newPassword: dto.newPassword });
  }
}
