import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async list(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews;
  }

  async create(userId: number, dto: { productId: number; rating: number; comment?: string }) {
    return this.prisma.review.create({ data: { userId, productId: dto.productId, rating: dto.rating, comment: dto.comment } });
  }

  async remove(userId: number, id: number) {
    const r = await this.prisma.review.findUnique({ where: { id } });
    if (!r || r.userId !== userId) throw new ForbiddenException();
    await this.prisma.review.delete({ where: { id } });
    return { ok: true };
  }
}


