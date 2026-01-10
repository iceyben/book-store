// types/product.dto.ts
export interface CreateProductDto {
  id?: string;       // optional, for using an existing book
  isbn?: string;     // optional if using ID
  title?: string;
  author?: string;
  price?: number;
  stock?: number;
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
