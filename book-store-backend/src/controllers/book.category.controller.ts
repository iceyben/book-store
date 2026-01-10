import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  private categoryService = new CategoryService();

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({
        message: "Category created successfully",
        category,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getCategories = async (_req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({
        message: "Categories fetched successfully",
        categories,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      res.status(200).json({
        message: "Category fetched successfully",
        category,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.deleteCategory(req.params.id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
