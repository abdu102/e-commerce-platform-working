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
    return reviews.map((r: any) => ({
      ...r,
      photos: r.photos ? JSON.parse(r.photos) : null,
    }));
  }

  async create(userId: number, dto: { productId: number; rating: number; comment?: string; photos?: string[] }) {
    return this.prisma.review.create({ data: { 
      userId, 
      productId: dto.productId, 
      rating: dto.rating, 
      comment: dto.comment,
      photos: dto.photos ? JSON.stringify(dto.photos) : undefined
    } });
  }

  async remove(userId: number, id: number) {
    const r = await this.prisma.review.findUnique({ where: { id } });
    if (!r || r.userId !== userId) throw new ForbiddenException();
    await this.prisma.review.delete({ where: { id } });
    return { ok: true };
  }
}


