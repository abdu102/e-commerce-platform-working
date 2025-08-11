import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from '../../orders/orders.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from '../dto/v2.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/orders')
export class OrdersV2Controller {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  async list() { return this.orders.findMine(); }

  @Post()
  async create(@Body() dto: CreateOrderDto) { return this.orders.create(dto); }
}
