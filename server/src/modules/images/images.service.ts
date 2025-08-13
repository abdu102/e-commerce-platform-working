import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async upsert(name: string, contentType: string | undefined, data: Buffer) {
    const existing = await this.prisma.image.findUnique({ where: { name } }).catch(() => null);
    if (existing) {
      return this.prisma.image.update({ where: { id: existing.id }, data: { data, contentType } });
    }
    return this.prisma.image.create({ data: { name, contentType: contentType ?? null, data } });
  }

  async getByName(name: string) {
    const img = await this.prisma.image.findUnique({ where: { name } });
    if (!img) throw new NotFoundException('Image not found');
    return img;
  }
}


