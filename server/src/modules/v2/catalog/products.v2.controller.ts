import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { PaginationDto } from '../dto/pagination.dto';

@Controller('api/v2/products')
export class ProductsV2Controller {
  constructor(private readonly products: ProductsService) {}

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
    return { items, total: products.length, page, pageSize };
  }
}
