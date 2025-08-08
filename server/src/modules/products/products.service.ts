import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(categoryId?: number, search?: string) {
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await this.prisma.product.findMany({ 
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' } 
    });
    
    return products.map((p: any) => ({ 
      ...p, 
      price: p.price / 100,
      specs: p.specs ? JSON.parse(p.specs) : null
    }));
  }

  async get(id: number) {
    const p = await this.prisma.product.findUnique({ 
      where: { id },
      include: { category: true }
    });
    if (!p) return null;
    return { 
      ...p, 
      price: p.price / 100,
      specs: p.specs ? JSON.parse(p.specs) : null
    };
  }

  async create(data: { 
    name: string; 
    description: string; 
    price: number; 
    categoryId: number;
    stock: number;
    imageUrl?: string;
    specs?: string;
  }) {
    const created = await this.prisma.product.create({ 
      data: { ...data, price: Math.round(data.price * 100) },
      include: { category: true }
    });
    return { 
      ...created, 
      price: created.price / 100,
      specs: created.specs ? JSON.parse(created.specs) : null
    };
  }

  async update(id: number, data: any) {
    if (data.price !== undefined) {
      data.price = Math.round(data.price * 100);
    }
    if (data.specs && typeof data.specs !== 'string') {
      data.specs = JSON.stringify(data.specs);
    }
    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
    
    return { 
      ...updated, 
      price: updated.price / 100,
      specs: updated.specs ? JSON.parse(updated.specs) : null
    };
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}


