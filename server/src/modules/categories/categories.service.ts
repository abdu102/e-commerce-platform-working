import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const categories = await this.prisma.category.findMany({
      include: { products: true },
      orderBy: { name: 'asc' },
    });
    
    return categories.map((category: any) => ({
      ...category,
      products: category.products.map((product: any) => ({
        ...product,
        price: product.price / 100,
        specs: product.specs ? JSON.parse(product.specs) : null
      }))
    }));
  }

  async get(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    
    if (!category) return null;
    
    return {
      ...category,
      products: category.products.map((product: any) => ({
        ...product,
        price: product.price / 100,
        specs: product.specs ? JSON.parse(product.specs) : null
      }))
    };
  }

  async create(data: { name: string; imageUrl?: string }) {
    return this.prisma.category.create({ data });
  }

  async update(id: number, data: { name?: string; imageUrl?: string }) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}


