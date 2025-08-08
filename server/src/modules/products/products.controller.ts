import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  description!: string;
  @IsNumber()
  @Min(0)
  price!: number; // dollars
  @IsNumber()
  categoryId!: number;
  @IsNumber()
  @Min(0)
  stock!: number;
  @IsOptional()
  @IsString()
  imageUrl?: string;
  @IsOptional()
  @IsString()
  specs?: string;
}

class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
  @IsOptional()
  @IsString()
  imageUrl?: string;
  @IsOptional()
  @IsString()
  specs?: string;
}

@Controller('api/products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  list(@Query('categoryId') categoryId?: string, @Query('search') search?: string) {
    return this.service.list(
      categoryId ? parseInt(categoryId) : undefined,
      search
    );
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.get(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}


