import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wishlists
 *   description: User wishlist management
 */

/**
 * @swagger
 * /wishlists:
 *   get:
 *     summary: Get current user's wishlist
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 */
router.get("/", authenticate, WishlistController.getWishlist);

/**
 * @swagger
 * /wishlists:
 *   post:
 *     summary: Add a book to wishlist
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book added to wishlist
 */
router.post("/", authenticate, WishlistController.addToWishlist);

/**
 * @swagger
 * /wishlists/{bookId}:
 *   delete:
 *     summary: Remove a book from wishlist
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from wishlists
 */
router.delete("/:bookId", authenticate, WishlistController.removeFromWishlist);

export default router;
