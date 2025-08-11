import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from '../../reviews/reviews.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReviewDto } from '../dto/v2.dto';

@Controller('api/v2/reviews')
export class ReviewsV2Controller {
  constructor(private readonly reviews: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':productId')
  async list(@Param('productId') productId: string) {
    const list = await this.reviews.list(Number(productId));
    return list.map((r: any) => ({
      id: String(r.id),
      productId: String(r.productId),
      author: (r.user?.name as string) || null,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async create(@Req() req: any, @Param('productId') productId: string, @Body() body: ReviewDto) {
    const created = await this.reviews.create(req.user.sub, { productId: Number(productId), rating: body.rating, comment: body.comment });
    return { id: String(created.id), productId: String(created.productId), author: req.user.email || null, rating: created.rating, comment: created.comment, createdAt: created.createdAt };
  }
}
