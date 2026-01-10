import { Request, Response } from "express";
import { WishlistService } from "../services/wishlist.service";

/**
 * 🖤 Wishlist Controller
 */
export class WishlistController {
  static async getWishlist(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const wishlist = await WishlistService.getWishlist(req.user.id);
      return res.status(200).json(wishlist);
    } catch (err) {
      return res.status(500).json({ message: err instanceof Error ? err.message : "Server error" });
    }
  }

  static async addToWishlist(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ message: "bookId is required" });

    try {
      const wishlistItem = await WishlistService.addToWishlist(req.user.id, bookId);
      return res.status(201).json(wishlistItem);
    } catch (err) {
      return res.status(400).json({ message: err instanceof Error ? err.message : "Server error" });
    }
  }

  static async removeFromWishlist(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { bookId } = req.params;

    try {
      await WishlistService.removeFromWishlist(req.user.id, bookId);
      return res.status(200).json({ message: "Book removed from wishlist" });
    } catch (err) {
      return res.status(404).json({ message: err instanceof Error ? err.message : "Server error" });
    }
  }
}
