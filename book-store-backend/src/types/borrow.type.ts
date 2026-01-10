import { BaseEntity, BorrowStatus } from "./common.type";

export interface Borrow extends BaseEntity {
  userId: string;
  bookId: string;
  borrowedAt: Date;
  dueDate: Date;
  status: BorrowStatus;
  approvedBy?: string; // admin id
}
