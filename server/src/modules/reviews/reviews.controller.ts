import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

class CreateReviewDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];
}

@Controller('api/reviews')
@UseGuards(RolesGuard)
@Roles('USER', 'ADMIN', 'SUPER_ADMIN')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Get(':productId')
  list(@Param('productId', ParseIntPipe) productId: number) {
    return this.service.list(productId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateReviewDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(req.user.userId, id);
  }
}


