import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QnaService {
  constructor(private prisma: PrismaService) {}

  async list(productId: number) {
    return this.prisma.question.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true } },
        answers: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createQuestion(userId: number, dto: { productId: number; content: string }) {
    return this.prisma.question.create({ data: { userId, productId: dto.productId, content: dto.content } });
  }

  async createAnswer(userId: number, dto: { questionId: number; content: string }) {
    return this.prisma.answer.create({ data: { userId, questionId: dto.questionId, content: dto.content } });
  }

  async removeQuestion(userId: number, id: number) {
    const q = await this.prisma.question.findUnique({ where: { id } });
    if (!q || q.userId !== userId) throw new ForbiddenException();
    await this.prisma.answer.deleteMany({ where: { questionId: id } });
    await this.prisma.question.delete({ where: { id } });
    return { ok: true };
  }

  async removeAnswer(userId: number, id: number) {
    const a = await this.prisma.answer.findUnique({ where: { id } });
    if (!a || a.userId !== userId) throw new ForbiddenException();
    await this.prisma.answer.delete({ where: { id } });
    return { ok: true };
  }
}


