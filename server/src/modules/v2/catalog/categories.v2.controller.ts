import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../../categories/categories.service';
import { ImagesService } from '../../images/images.service';

@Controller('api/v2/categories')
export class CategoriesV2Controller {
  constructor(private readonly categories: CategoriesService, private readonly images: ImagesService) {}

  @Get()
  async list() {
    const cats = await this.categories.list();
    return cats.map((c: any) => ({
      id: String(c.id),
      name: c.name ?? c.title ?? '',
      // Always serve from DB-backed images with cache-busting query
      imageUrl: `/api/v2/images/${encodeURIComponent(c.name)}?v=1`,
    }));
  }
}
