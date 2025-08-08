import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, RolesGuard],
})
export class ProductsModule {}


