import prisma from "../lib/prisma";

/**
 * 🛒 Order Service
 * Handles order creation and stock management
 */
export class OrderService {
  /**
   * Create an order from user's cart
   */
  static async createOrder(userId: string) {
    // 1️⃣ Get active cart with items
    const cart = await prisma.cart.findFirst({
      where: { userId, isActive: true },
      include: { items: { include: { book: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2️⃣ Calculate total and check stock
    let total = 0;

    for (const item of cart.items) {
      if (item.quantity > item.book.quantity) {
        throw new Error(`Not enough stock for ${item.book.title}`);
      }
      total += (item.book.price ?? 0) * item.quantity;
    }

    // 3️⃣ Create order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            bookId: item.bookId,
            price: item.book.price ?? 0,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: { include: { book: true } } },
    });

    // 4️⃣ Reduce stock for each book
    for (const item of cart.items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: { quantity: item.book.quantity - item.quantity },
      });
    }

    // 5️⃣ Clear the cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  /**
   * Get orders for a user
   */
  static async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { book: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get a single order by ID
   */
  static async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { book: true } } },
    });

    if (!order) throw new Error("Order not found");
    return order;
  }
}
