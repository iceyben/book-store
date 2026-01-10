import { Types, Document } from "mongoose";

export interface BookDocument extends Document {
  title: string;
  author: string;
  isbn: string;
  imageUrl?: string;
  quantity: number;
  available: number;
  categoryId: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}
