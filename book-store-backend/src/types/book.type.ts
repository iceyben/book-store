export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  imageUrl?: string;
  quantity: number;
  categoryId: string; // API always uses string
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  imageUrl?: string;
  quantity?: number;
  available?: number;
  categoryId?: string;
}
