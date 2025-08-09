import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsInt } from 'class-validator';

class ToggleDto {
  @IsInt()
  productId!: number;
}

@Controller('api/wishlist')
@UseGuards(RolesGuard)
@Roles('USER', 'ADMIN', 'SUPER_ADMIN')
export class WishlistController {
  constructor(private service: WishlistService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.list(req.user.userId);
  }

  @Post('toggle')
  toggle(@Req() req: any, @Body() dto: ToggleDto) {
    return this.service.toggle(req.user.userId, dto.productId);
  }

  @Delete(':productId')
  remove(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.service.remove(req.user.userId, productId);
  }
}


