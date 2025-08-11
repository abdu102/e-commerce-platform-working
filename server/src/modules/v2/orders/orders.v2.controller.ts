import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from '../../orders/orders.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateOrderDto } from '../dto/v2.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/orders')
export class OrdersV2Controller {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  async list() { return this.orders.list((null as any)); }

  @Post()
  async create(@Body() dto: CreateOrderDto) { return this.orders.create((null as any), dto.items, dto.address); }
}
