import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../../categories/categories.service';

@Controller('api/v2/categories')
export class CategoriesV2Controller {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  async list() {
    const cats = await this.categories.list();
    return cats.map((c: any) => ({ id: String(c.id), name: c.name ?? c.title ?? '', imageUrl: c.imageUrl || c.image || c.thumbnail || null }));
  }
}
