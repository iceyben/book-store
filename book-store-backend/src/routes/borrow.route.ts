import { Router } from "express";
import { BorrowController } from "../controllers/borrow.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../types/common.type";

const router = Router();
const controller = new BorrowController();

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Borrow and return book management
 */

/**
 * @swagger
 * /borrows/request:
 *   post:
 *     summary: Request to borrow a book
 *     tags: [Borrow]
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
 *                 example: 1d3fe4c8-4662-4a48-99e1-4da2d7aa2a3a
 *     responses:
 *       201:
 *         description: Borrow request submitted
 *       400:
 *         description: Book unavailable or duplicate request
 */
router.post("/request", authenticate, controller.requestBorrow);

/**
 * @swagger
 * /borrows/return/{id}:
 *   post:
 *     summary: Request to return a borrowed book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow record ID
 *     responses:
 *       200:
 *         description: Return request submitted
 *       400:
 *         description: Invalid return request
 */
router.post("/return/:id", authenticate, controller.requestReturn);

/**
 * @swagger
 * /borrows/my:
 *   get:
 *     summary: Get my borrow records
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's borrow records
 */
router.get("/my", authenticate, controller.getMyBorrows);

/**
 * @swagger
 * /borrows:
 *   get:
 *     summary: Get all borrow records (Admin)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all borrow records
 */
router.get("/", authenticate, authorize(UserRole.ADMIN), controller.getAllBorrows);

/**
 * @swagger
 * /borrows/approve/{id}:
 *   post:
 *     summary: Approve a borrow request (Admin)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Borrow approved
 */
router.post("/approve/:id", authenticate, authorize(UserRole.ADMIN), controller.approveBorrow);

/**
 * @swagger
 * /borrows/approve-return/{id}:
 *   post:
 *     summary: Approve a return request (Admin)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow record ID
 *     responses:
 *       200:
 *         description: Return approved
 */
router.post("/approve-return/:id", authenticate, authorize(UserRole.ADMIN), controller.approveReturn);

export default router;
