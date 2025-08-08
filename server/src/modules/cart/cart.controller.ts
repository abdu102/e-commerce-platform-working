import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsInt, Min } from 'class-validator';

class AddToCartDto {
  @IsInt()
  @Min(1)
  productId!: number;
  @IsInt()
  @Min(1)
  quantity!: number;
}

class UpdateQuantityDto {
  @IsInt()
  @Min(0)
  quantity!: number;
}

@Controller('api/cart')
@UseGuards(RolesGuard)
@Roles('USER', 'ADMIN', 'SUPER_ADMIN')
export class CartController {
  constructor(private service: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.service.getCart(req.user.userId);
  }

  @Post()
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.service.addToCart(req.user.userId, dto.productId, dto.quantity);
  }

  @Put(':id')
  updateQuantity(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuantityDto) {
    return this.service.updateQuantity(req.user.userId, id, dto.quantity);
  }

  @Delete(':id')
  removeFromCart(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.removeFromCart(req.user.userId, id);
  }

  @Delete()
  clearCart(@Req() req: any) {
    return this.service.clearCart(req.user.userId);
  }
}
