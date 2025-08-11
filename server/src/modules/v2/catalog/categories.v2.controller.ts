import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../../categories/categories.service';

@Controller('api/v2/categories')
export class CategoriesV2Controller {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  async list() {
    return this.categories.findAll();
  }
}
