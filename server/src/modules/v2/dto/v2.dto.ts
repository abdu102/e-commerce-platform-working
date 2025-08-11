import { IsEmail, IsString, IsOptional, IsInt, Min, IsArray, ValidateNested } from 'class-validator';

export class LoginDto { 
  @IsEmail() email!: string; 
  @IsString() password!: string; 
}

export class RegisterDto { 
  @IsOptional() @IsString() name?: string; 
  @IsEmail() email!: string; 
  @IsString() password!: string; 
}

export class RefreshDto { 
  @IsString() refreshToken!: string; 
}

export class ReviewDto { 
  @IsInt() @Min(1) rating!: number; 
  @IsString() comment!: string; 
}

export class AddToCartDto { 
  @IsInt() @Min(1) productId!: number; 
  @IsInt() @Min(1) quantity!: number; 
}

export class UpdateCartDto { 
  @IsString() itemId!: string; 
  @IsInt() @Min(1) quantity!: number; 
}

export class RemoveCartDto { 
  @IsString() itemId!: string; 
}

export class CreateOrderDto { 
  @IsArray() items!: { productId: number; quantity: number }[]; 
  @IsString() address!: string; 
}
