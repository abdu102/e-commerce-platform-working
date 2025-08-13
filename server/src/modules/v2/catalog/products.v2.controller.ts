import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { PaginationDto } from '../dto/pagination.dto';
import { ImagesService } from '../../images/images.service';

@Controller('api/v2/products')
export class ProductsV2Controller {
  constructor(private readonly products: ProductsService, private readonly images: ImagesService) {}

  @Get()
  async list(@Query() q: PaginationDto) {
    const page = Math.max(1, Number(q.page || 1));
    const pageSize = Math.max(1, Math.min(100, Number(q.pageSize || 20)));
    // Map to existing service API (list(categoryId?, search?))
    const categoryId = q.categoryId ? Number(q.categoryId) : undefined;
    const products = await this.products.list(categoryId, q.q);
    // manual paging
    const start = (page - 1) * pageSize;
    const items = products.slice(start, start + pageSize);
    const normalized = items.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      priceCents: Math.round(Number(p.price ?? 0) * 100),
      imageUrl: p.name ? `/api/v2/images/${encodeURIComponent(p.name)}-1?v=1` : null,
      images: p.name ? [
        `/api/v2/images/${encodeURIComponent(p.name)}-1?v=1`,
        `/api/v2/images/${encodeURIComponent(p.name)}-2?v=1`
      ] : [],
      categoryId: String(p.categoryId ?? p.category?.id ?? ''),
      stock: p.stock ?? p.quantity ?? 0,
      categoryName: p.category?.name ?? undefined,
      rating: p.rating ?? p.avgRating ?? undefined,
    }));
    return { items: normalized, total: products.length, page, pageSize };
  }
}
