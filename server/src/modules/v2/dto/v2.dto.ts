export class LoginDto { email!: string; password!: string; }
export class RegisterDto { name?: string; email!: string; password!: string; }
export class ReviewDto { rating!: number; comment!: string; }
export class AddToCartDto { productId!: number; quantity!: number; }
export class UpdateCartDto { itemId!: string; quantity!: number; }
export class RemoveCartDto { itemId!: string; }
export class CreateOrderDto { items!: { productId: number; quantity: number }[]; address!: string; }
