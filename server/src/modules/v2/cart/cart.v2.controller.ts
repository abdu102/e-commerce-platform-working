import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CartService } from '../../cart/cart.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddToCartDto, RemoveCartDto, UpdateCartDto } from '../dto/v2.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/cart')
export class CartV2Controller {
  constructor(private readonly cart: CartService) {}
  @Get()
  async getCart() { return this.cart.getCart(); }
  @Post()
  async add(@Body() body: AddToCartDto) { return this.cart.add(body); }
  @Put()
  async update(@Body() body: UpdateCartDto) { return this.cart.update(body); }
  @Delete()
  async remove(@Body() body: RemoveCartDto) { return this.cart.remove(body); }
}
