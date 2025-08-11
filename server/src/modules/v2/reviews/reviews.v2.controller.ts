import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../../reviews/reviews.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReviewDto } from '../dto/v2.dto';

@Controller('api/v2/reviews')
export class ReviewsV2Controller {
  constructor(private readonly reviews: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':productId')
  async list(@Param('productId') productId: string) { return this.reviews.find(productId); }

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async create(@Param('productId') productId: string, @Body() body: ReviewDto) { return this.reviews.create(productId, body); }
}
