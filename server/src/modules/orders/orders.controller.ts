import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { IsArray, IsInt, Min, ValidateNested, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

class OrderItemDto {
  @IsInt()
  @Min(1)
  productId!: number;
  @IsInt()
  @Min(1)
  quantity!: number;
}

class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsString()
  address!: string;
}

class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

@Controller('api/orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Get()
  @Roles('USER', 'ADMIN', 'SUPER_ADMIN')
  list(@Req() req: any) {
    return this.service.list(req.user.userId);
  }

  @Get('all')
  @Roles('ADMIN', 'SUPER_ADMIN')
  listAll() {
    return this.service.listAll();
  }

  @Post()
  @Roles('USER', 'ADMIN', 'SUPER_ADMIN')
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.service.create(req.user.userId, dto.items, dto.address);
  }

  @Put(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.service.update(id, dto);
  }
}


