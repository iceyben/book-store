import { Request, Response } from "express";
import { BorrowService } from "../services/borrow.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class BorrowController {
  private borrowService = new BorrowService();

  requestBorrow = async (req: AuthRequest, res: Response) => {
    try {
      const borrow = await this.borrowService.requestBorrow(req.user!.id, req.body.bookId);
      res.status(201).json({ message: "Borrow request submitted", borrow });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  requestReturn = async (req: AuthRequest, res: Response) => {
    try {
      const borrow = await this.borrowService.requestReturn(req.user!.id, req.params.id);
      res.json({ message: "Return request submitted", borrow });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getMyBorrows = async (req: AuthRequest, res: Response) => {
    try {
      const borrows = await this.borrowService.getMyBorrows(req.user!.id);
      res.json({ message: "User borrows fetched successfully", borrows });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getAllBorrows = async (_req: Request, res: Response) => {
    try {
      const borrows = await this.borrowService.getAllBorrows();
      res.json({ message: "All borrows fetched successfully", borrows });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  approveBorrow = async (req: Request, res: Response) => {
    try {
      const borrow = await this.borrowService.approveBorrow(req.params.id);
      res.json({ message: "Borrow approved", borrow });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  approveReturn = async (req: Request, res: Response) => {
    try {
      const borrow = await this.borrowService.approveReturn(req.params.id);
      res.json({ message: "Return approved", borrow });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
