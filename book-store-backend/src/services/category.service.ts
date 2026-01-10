// src/services/category.service.ts
import  prisma from "../lib/prisma"; // make sure this points to your Prisma client

export class CategoryService {
  // Create a new category
  async createCategory(data: { name: string; description?: string }) {
    return await prisma.category.create({
      data,
    });
  }

  // Get all categories
  async getAllCategories() {
    return await prisma.category.findMany();
  }

  // Get category by ID
  async getCategoryById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  // Update category by ID
  async updateCategory(id: string, data: { name?: string; description?: string }) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  // Delete category by ID
  async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}
