import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: { name: string; email: string; password: string }) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    return this.authService.login(data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req) {
    return this.authService.me(req.user.sub);
  }
}


