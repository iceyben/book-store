// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({
        message: "User created successfully",
        user
      });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  getUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.json({
      message: "Users fetched successfully",
      users
    });
  };

  getUser = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User fetched successfully",
      user
    });
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json({
        message: "User updated successfully",
        user
      });
    } catch {
      res.status(404).json({ message: "User not found" });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch {
      res.status(404).json({ message: "User not found" });
    }
  };
}
