import { Module } from '@nestjs/common';
import { AuthModule } from '../../modules/auth/auth.module';
import { ProductsModule } from '../../modules/products/products.module';
import { CategoriesModule } from '../../modules/categories/categories.module';
import { CartModule } from '../../modules/cart/cart.module';
import { OrdersModule } from '../../modules/orders/orders.module';
import { ReviewsModule } from '../../modules/reviews/reviews.module';
import { UsersModule } from '../../modules/users/users.module';
import { UsersV2Controller } from './users/users.v2.controller';
import { WishlistModule } from '../../modules/wishlist/wishlist.module';
import { WishlistV2Controller } from './wishlist/wishlist.v2.controller';
import { AuthV2Controller } from './auth/auth.v2.controller';
import { ProductsV2Controller } from './catalog/products.v2.controller';
import { CategoriesV2Controller } from './catalog/categories.v2.controller';
import { CartV2Controller } from './cart/cart.v2.controller';
import { OrdersV2Controller } from './orders/orders.v2.controller';
import { ReviewsV2Controller } from './reviews/reviews.v2.controller';

@Module({
  imports: [AuthModule, ProductsModule, CategoriesModule, CartModule, OrdersModule, ReviewsModule, UsersModule, WishlistModule],
  controllers: [
    AuthV2Controller,
    ProductsV2Controller,
    CategoriesV2Controller,
    CartV2Controller,
    OrdersV2Controller,
    ReviewsV2Controller,
    UsersV2Controller,
    WishlistV2Controller,
  ],
})
export class V2Module {}
