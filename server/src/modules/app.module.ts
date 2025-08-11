import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { QnaModule } from './qna/qna.module';
import { V2Module } from './v2/v2.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    CartModule,
    UsersModule,
    ReviewsModule,
    WishlistModule,
    QnaModule,
    V2Module,
  ],
  controllers: [AppController],
})
export class AppModule {}


