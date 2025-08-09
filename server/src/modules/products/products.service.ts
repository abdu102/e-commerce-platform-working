import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(
    categoryId?: number,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    sort?: 'price_asc' | 'price_desc' | 'newest'
  ) {
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

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Math.round(minPrice * 100);
      if (maxPrice !== undefined) where.price.lte = Math.round(maxPrice * 100);
    }

    if (inStock !== undefined) {
      where.stock = inStock ? { gt: 0 } : { equals: 0 };
    }

    const orderBy =
      sort === 'price_asc'
        ? { price: 'asc' as const }
        : sort === 'price_desc'
        ? { price: 'desc' as const }
        : { createdAt: 'desc' as const };

    const products = await this.prisma.product.findMany({ where, include: { category: true }, orderBy });
    
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


