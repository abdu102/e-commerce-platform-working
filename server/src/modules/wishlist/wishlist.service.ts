import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async list(userId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: { include: { category: true } } }
    });
  }

  async toggle(userId: number, productId: number) {
    const existing = await this.prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
    if (existing) {
      await this.prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { wished: false };
    }
    await this.prisma.wishlistItem.create({ data: { userId, productId } });
    return { wished: true };
  }

  async remove(userId: number, productId: number) {
    const existing = await this.prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
    if (existing) await this.prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { ok: true };
  }
}


