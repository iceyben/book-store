import prisma from "../lib/prisma";
import { BorrowStatus } from "../types/common.type";

export class BorrowService {
  async requestBorrow(userId: string, bookId: string) {
    // Check book availability
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.available <= 0) {
      throw new Error("Book not available");
    }

    // Prevent duplicate active borrow
    const existingBorrow = await prisma.borrow.findFirst({
      where: {
        userId,
        bookId,
        status: { in: [BorrowStatus.PENDING, BorrowStatus.APPROVED] },
      },
    });
    if (existingBorrow) {
      throw new Error("You already have an active borrow for this book");
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
        status: BorrowStatus.PENDING,
      },
    });

    return borrow;
  }

  async requestReturn(userId: string, borrowId: string) {
    const borrow = await prisma.borrow.findUnique({ where: { id: borrowId } });

    if (!borrow || borrow.userId !== userId || borrow.status !== BorrowStatus.APPROVED) {
      throw new Error("Invalid return request");
    }

    const updated = await prisma.borrow.update({
      where: { id: borrowId },
      data: { status: BorrowStatus.PENDING },
    });

    return updated;
  }

  async getMyBorrows(userId: string) {
    return prisma.borrow.findMany({
      where: { userId },
      include: { book: true },
    });
  }

  async getAllBorrows() {
    return prisma.borrow.findMany({
      include: { book: true, user: true },
    });
  }

  async approveBorrow(borrowId: string) {
    const borrow = await prisma.borrow.findUnique({ where: { id: borrowId } });
    if (!borrow || borrow.status !== BorrowStatus.PENDING) {
      throw new Error("Invalid borrow request");
    }

    const book = await prisma.book.findUnique({ where: { id: borrow.bookId } });
    if (!book || book.available <= 0) {
      throw new Error("Book unavailable");
    }

    await prisma.book.update({
      where: { id: book.id },
      data: { available: book.available - 1 },
    });

    const updated = await prisma.borrow.update({
      where: { id: borrowId },
      data: { status: BorrowStatus.APPROVED, borrowedAt: new Date() },
    });

    return updated;
  }

  async approveReturn(borrowId: string) {
    const borrow = await prisma.borrow.findUnique({ where: { id: borrowId } });
    if (!borrow || borrow.status !== BorrowStatus.PENDING) {
      throw new Error("Invalid return approval");
    }

    const book = await prisma.book.findUnique({ where: { id: borrow.bookId } });
    if (book) {
      await prisma.book.update({
        where: { id: book.id },
        data: { available: book.available + 1 },
      });
    }

    const updated = await prisma.borrow.update({
      where: { id: borrowId },
      data: { status: BorrowStatus.RETURNED, returnedAt: new Date() },
    });

    return updated;
  }
}
