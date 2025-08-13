import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { WishlistService } from '../../wishlist/wishlist.service';

@Controller('api/v2/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistV2Controller {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  async list(@Req() req: any) {
    const raw = req.user?.sub ?? req.user?.userId;
    const userId: number = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    return this.wishlist.list(userId);
  }

  @Post('toggle')
  async toggle(@Req() req: any, @Body() dto: { productId: number }) {
    const raw = req.user?.sub ?? req.user?.userId;
    const userId: number = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    return this.wishlist.toggle(userId, Number(dto.productId));
  }

  @Delete(':productId')
  async remove(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    const raw = req.user?.sub ?? req.user?.userId;
    const userId: number = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    return this.wishlist.remove(userId, Number(productId));
  }
}


