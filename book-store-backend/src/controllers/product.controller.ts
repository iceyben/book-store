import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  // Create or update product
  static async create(req: Request, res: Response) {
    try {
      const book = await ProductService.createOrUpdateProduct(req.body);
      res.status(201).json({ message: "Product saved successfully", book });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Server error" });
    }
  }

  // Get all products
  static async getAll(req: Request, res: Response) {
    try {
      const books = await ProductService.getAllProducts();
      res.status(200).json({ message: "Products retrieved successfully", books });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Server error" });
    }
  }

  // Get product by ID
  static async getOne(req: Request, res: Response) {
    try {
      const book = await ProductService.getProductById(req.params.id);
      if (!book) return res.status(404).json({ message: "Product not found" });
      res.status(200).json({ message: "Product retrieved successfully", book });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Server error" });
    }
  }

  // Update product
  static async update(req: Request, res: Response) {
    try {
      const book = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({ message: "Product updated successfully", book });
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(400).json({ message: err.message || "Server error" });
    }
  }

  // Delete product
  static async delete(req: Request, res: Response) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(500).json({ message: err.message || "Server error" });
    }
  }
}
