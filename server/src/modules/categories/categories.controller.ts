import { Controller, Get, Param, ParseIntPipe, Post, Body, UseGuards, Put, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

@Controller('api/categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.get(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}


