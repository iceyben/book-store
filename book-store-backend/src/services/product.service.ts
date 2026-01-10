import { PrismaClient } from "@prisma/client";
import { CreateProductDto, UpdateProductDto } from "../types/product.dto";

const prisma = new PrismaClient();

export class ProductService {
  // Create or update product
  static async createOrUpdateProduct(data: CreateProductDto) {
    const { id, isbn, title, author, price, stock, imageUrl, categoryId } = data;

    let book;

    if (id) {
      // Use existing book by ID
      book = await prisma.book.findUnique({ where: { id } });
      if (!book) throw new Error("Book not found");

      book = await prisma.book.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(author && { author }),
          ...(price !== undefined && { price }),
          ...(stock !== undefined && { quantity: stock, available: stock }),
          ...(imageUrl && { imageUrl }),
          ...(categoryId && { categoryId }),
          isForSale: true,
        },
      });

    } else if (isbn) {
      // Use existing book by ISBN
      book = await prisma.book.findUnique({ where: { isbn } });

      if (book) {
        book = await prisma.book.update({
          where: { isbn },
          data: {
            ...(title && { title }),
            ...(author && { author }),
            ...(price !== undefined && { price }),
            ...(stock !== undefined && { quantity: stock, available: stock }),
            ...(imageUrl && { imageUrl }),
            ...(categoryId && { categoryId }),
            isForSale: true,
          },
        });
      } else {
        // Create new book
        book = await prisma.book.create({
          data: {
            title: title ?? "",
            author: author ?? "",
            isbn: isbn ?? "",
            price: price ?? 0,
            quantity: stock ?? 0,
            available: stock ?? 0,
            isForSale: true,
            imageUrl: imageUrl ?? "",
            categoryId: categoryId ?? "",
          },
        });
      }
    } else {
      throw new Error("Book ID or ISBN is required");
    }

    return book;
  }

  static async getAllProducts() {
    return prisma.book.findMany({
      where: { isForSale: true },
      include: { category: true },
    });
  }

  static async getProductById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  static async updateProduct(id: string, data: UpdateProductDto) {
    return prisma.book.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.author && { author: data.author }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { quantity: data.stock, available: data.stock }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.categoryId && { categoryId: data.categoryId }),
      },
    });
  }

  static async deleteProduct(id: string) {
    return prisma.book.delete({ where: { id } });
  }
}
