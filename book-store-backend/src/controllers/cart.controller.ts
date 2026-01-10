import { Request, Response } from "express";
import prisma  from "../lib/prisma";

/**
 * 🛒 Cart Controller
 */
export class CartController {
  /**
   * Get current user's cart
   */
  static async getCart(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    return res.status(200).json(cart ?? { items: [] });
  }

  /**
   * Add book to cart
   */
  static async addToCart(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { bookId, quantity = 1 } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "bookId is required" });
    }

    // Ensure cart exists
    let cart = await prisma.cart.findFirst({
      where: { userId, isActive: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          isActive: true,
        },
      });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return res.status(200).json(updatedItem);
    }

    // Add new item
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        bookId,
        quantity,
      },
    });

    return res.status(201).json(cartItem);
  }

  /**
   * Update cart item quantity
   * (Matches Swagger + route: updateCartItem)
   */
  static async updateCartItem(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be at least 1" });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return res.status(200).json(updatedItem);
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { bookId } = req.params;

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return res.status(200).json({ message: "Item removed from cart" });
  }
}
