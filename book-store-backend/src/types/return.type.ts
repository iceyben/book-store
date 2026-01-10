// types/product.dto.ts
export interface CreateProductDto {
  isbn?: string;       // optional if using existing book
  title?: string;
  author?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: string;
}

export interface UpdateProductDto {
  title?: string;
  author?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
}
