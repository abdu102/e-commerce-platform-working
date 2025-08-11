import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from '../../orders/orders.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateOrderDto } from '../dto/v2.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/orders')
export class OrdersV2Controller {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  async list(@Req() req: any) {
    const raw = await this.orders.list(Number(req.user.sub));
    return raw.map(orderToMobileShape);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const created = await this.orders.create(Number(req.user.sub), dto.items, dto.address);
    return orderToMobileShape(created);
  }
}

function orderToMobileShape(order: any) {
  const toCents = (v: any) => Math.round(Number(v || 0) * 100);
  const items = (order.items || []).map((it: any) => ({
    id: String(it.id),
    productId: String(it.productId),
    quantity: it.quantity,
    priceCents: toCents(it.unitPrice),
    product: it.product || null,
  }));
  const shippingAddress = typeof order.address === 'string'
    ? { fullName: '', line1: order.address, line2: null, city: '', state: '', postalCode: '', country: '' }
    : (order.address || { fullName: '', line1: '', line2: null, city: '', state: '', postalCode: '', country: '' });
  return {
    id: String(order.id),
    userId: String(order.userId ?? ''),
    items,
    status: order.status || 'PAID',
    totalCents: toCents(order.total),
    createdAt: order.createdAt,
    shippingAddress,
  };
}
