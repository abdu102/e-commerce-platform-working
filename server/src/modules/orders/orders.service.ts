import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async create(userId: number, items: any[], address: string) {
    // Get products to calculate total
    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((it: any) => it.productId) } }
    });
    
    const productById = products.reduce((acc: any, p: any) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const total = items.reduce((sum: number, item: any) => {
      const product = productById[item.productId];
      return sum + (product.price * item.quantity);
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        address,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: productById[item.productId].price
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    return {
      ...order,
      total: order.total / 100,
      items: order.items.map((it: any) => ({ ...it, unitPrice: it.unitPrice / 100 }))
    };
  }

  async update(id: number, data: any) {
    const order = await this.prisma.order.update({
      where: { id },
      data,
      include: { items: { include: { product: true } } }
    });

    return {
      ...order,
      total: order.total / 100,
      items: order.items.map((it: any) => ({ ...it, unitPrice: it.unitPrice / 100 }))
    };
  }
}


