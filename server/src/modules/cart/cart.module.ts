import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [CartController],
  providers: [CartService, RolesGuard],
})
export class CartModule {}
