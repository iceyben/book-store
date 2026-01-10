import { Request, Response } from "express";
import { BookService } from "../services/book.service";

export class BookController {
  private bookService = new BookService();

  createBook = async (req: Request, res: Response) => {
    try {
      const book = await this.bookService.createBook(req.body);
      res.status(201).json({
        message: "Book created successfully",
        book,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getBooks = async (_req: Request, res: Response) => {
    try {
      const books = await this.bookService.getAllBooks();
      res.status(200).json({
        message: "Books fetched successfully",
        books,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  getBook = async (req: Request, res: Response) => {
    try {
      const book = await this.bookService.getBookById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      res.status(200).json({
        message: "Book fetched successfully",
        book,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  updateBook = async (req: Request, res: Response) => {
    try {
      const book = await this.bookService.updateBook(req.params.id, req.body);
      if (!book) return res.status(404).json({ message: "Book not found" });

      res.status(200).json({
        message: "Book updated successfully",
        book,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  deleteBook = async (req: Request, res: Response) => {
    try {
      const book = await this.bookService.deleteBook(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      res.status(200).json({ message: "Book deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };
}
