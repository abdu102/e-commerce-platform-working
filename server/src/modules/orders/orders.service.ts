import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Product } from '@prisma/client';

enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async list(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o: any) => ({
      ...o,
      total: o.total / 100,
      items: o.items.map((it: any) => ({ ...it, unitPrice: it.unitPrice / 100 }))
    }));
  }

  async listAll() {
    const orders = await this.prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o: any) => ({
      ...o,
      total: o.total / 100,
      items: o.items.map((it: any) => ({ ...it, unitPrice: it.unitPrice / 100 }))
    }));
  }

  async create(userId: number, items: Array<{ productId: number; quantity: number }>) {
    const productIds = items.map((i) => i.productId);
    const products: Product[] = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productById = new Map<number, Product>(products.map((p) => [p.id, p]));
    let total = 0;
    for (const it of items) {
      const p = productById.get(it.productId);
      if (!p) throw new NotFoundException(`Product ${it.productId} not found`);
      total += p.price * it.quantity;
    }
    const created = await this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: productById.get(it.productId)!.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
    return {
      ...created,
      total: created.total / 100,
      items: created.items.map((it: any) => ({ ...it, unitPrice: it.unitPrice / 100 })),
    };
  }

  async update(orderId: number, data: { status?: OrderStatus; address?: string | null; phone?: string | null }) {
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data,
      include: { items: { include: { product: true } } },
    });
    return {
      ...updated,
      total: updated.total / 100,
      items: updated.items.map((it: any) => ({ ...it, unitPrice: it.unitPrice / 100 }))
    };
  }
}


