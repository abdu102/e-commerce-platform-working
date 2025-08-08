import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return {
      items: items.map(item => ({
        ...item,
        product: { ...item.product, price: item.product.price / 100 }
      })),
      total: total / 100
    };
  }

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true }
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true }
    });
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId, userId },
      data: { quantity },
      include: { product: true }
    });
  }

  async removeFromCart(userId: number, itemId: number) {
    return this.prisma.cartItem.delete({
      where: { id: itemId, userId }
    });
  }

  async clearCart(userId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { userId }
    });
  }
}
