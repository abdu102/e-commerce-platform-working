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
    const res = await this.products.findAll({
      page,
      pageSize,
      q: q.q,
      categoryId: q.categoryId,
    });
    return res;
  }
}
