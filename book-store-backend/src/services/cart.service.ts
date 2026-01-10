import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CartService {
  // Get or create cart
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  // Get cart with items
  static async getCart(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  // Add item to cart
  static async addToCart(
    userId: string,
    bookId: string,
    quantity: number = 1
  ) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId,
        },
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        bookId,
        quantity,
      },
    });
  }

  // Update quantity
  static async updateCartItem(
    userId: string,
    bookId: string,
    quantity: number
  ) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return prisma.cartItem.update({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId,
        },
      },
      data: { quantity },
    });
  }

  // Remove item
  static async removeFromCart(userId: string, bookId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return prisma.cartItem.delete({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId,
        },
      },
    });
  }
}
