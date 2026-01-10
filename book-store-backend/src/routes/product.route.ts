import { Router } from "express"; 
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../types/common.type";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", ProductController.getAll);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product object
 *       404:
 *         description: Product not found
 */
router.get("/:id", ProductController.getOne);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (link to existing book or create new book)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Provide either an existing book ID or book details for a new book
 *             properties:
 *               id:
 *                 type: string
 *                 description: Existing Book ID (optional if creating new book)
 *               isbn:
 *                 type: string
 *                 description: Book ISBN (required if creating new book)
 *               title:
 *                 type: string
 *                 description: Book title (required if creating new book)
 *               author:
 *                 type: string
 *                 description: Book author (required if creating new book)
 *               price:
 *                 type: number
 *                 description: Selling price
 *               stock:
 *                 type: number
 *                 description: Quantity in stock
 *               imageUrl:
 *                 type: string
 *                 description: Image URL for the book
 *               categoryId:
 *                 type: string
 *                 description: Category ID (required if creating new book)
 *     responses:
 *       201:
 *         description: Product created successfully (new or existing book)
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found (if using existing book ID)
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  ProductController.create
);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a product (book selling info)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update for the product
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  ProductController.update
);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a product (book selling info)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  ProductController.delete
);

export default router;
