export interface AddToCartDto {
  bookId: string;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
