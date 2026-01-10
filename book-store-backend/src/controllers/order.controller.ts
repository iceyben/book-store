import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const order = await OrderService.createOrder(req.user.id);
      return res.status(201).json(order);
    } catch (err) {
      return res.status(400).json({ message: err instanceof Error ? err.message : "Server error" });
    }
  }

  static async getUserOrders(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const orders = await OrderService.getUserOrders(req.user.id);
      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json({ message: err instanceof Error ? err.message : "Server error" });
    }
  }

  static async getOrderById(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId, req.user.id);
      return res.status(200).json(order);
    } catch (err) {
      return res.status(404).json({ message: err instanceof Error ? err.message : "Order not found" });
    }
  }
}
