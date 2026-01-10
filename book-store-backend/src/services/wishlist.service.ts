import prisma from "../lib/prisma";

export class WishlistService {
  /**
   * Get wishlist items for a user
   */
  static async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: { book: true },
    });
  }

  /**
   * Add a book to wishlist
   * Prevent duplicates
   */
  static async addToWishlist(userId: string, bookId: string) {
    // Check if already exists
    const existing = await prisma.wishlist.findFirst({
      where: { userId, bookId },
    });

    if (existing) {
      throw new Error("Book already in wishlist");
    }

    return prisma.wishlist.create({
      data: { userId, bookId },
      include: { book: true },
    });
  }

  /**
   * Remove a book from wishlist
   */
  static async removeFromWishlist(userId: string, bookId: string) {
    const wishlistItem = await prisma.wishlist.findFirst({
      where: { userId, bookId },
    });

    if (!wishlistItem) {
      throw new Error("Book not found in wishlist");
    }

    return prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });
  }
}
