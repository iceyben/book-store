import prisma from "../lib/prisma";
import { CreateBookDTO, UpdateBookDTO } from "../types/book.type";

export class BookService {
  // Create a new book
  async createBook(data: CreateBookDTO) {
    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        imageUrl: data.imageUrl,
        quantity: data.quantity,
        available: data.quantity,
        categoryId: data.categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return book;
  }

  // Get all books
  async getAllBooks() {
    return prisma.book.findMany({
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Get a single book by ID
  async getBookById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  // Update book
  async updateBook(id: string, data: UpdateBookDTO) {
    // If quantity updated, adjust available
    if (data.quantity) {
      data.available = data.quantity;
    }

    return prisma.book.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  // Delete book
  async deleteBook(id: string) {
    return prisma.book.delete({
      where: { id },
    });
  }
}
