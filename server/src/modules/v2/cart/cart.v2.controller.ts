import { Body, Controller, Delete, Get, Post, Put, UseGuards, Req } from '@nestjs/common';
import { CartService } from '../../cart/cart.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AddToCartDto, RemoveCartDto, UpdateCartDto } from '../dto/v2.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/cart')
export class CartV2Controller {
  constructor(private readonly cart: CartService) {}
  @Get()
  async getCart(@Req() req: any) { return this.cart.getCart(req.user.sub); }
  @Post()
  async add(@Req() req: any, @Body() body: AddToCartDto) { return this.cart.addToCart(req.user.sub, body.productId, body.quantity); }
  @Put()
  async update(@Req() req: any, @Body() body: UpdateCartDto) { return this.cart.updateQuantity(req.user.sub, Number(body.itemId), body.quantity); }
  @Delete()
  async remove(@Req() req: any, @Body() body: RemoveCartDto) { return this.cart.removeFromCart(req.user.sub, Number(body.itemId)); }
}
