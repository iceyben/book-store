import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/user.validation.middleware";
import { verifyOTP } from "../middlewares/otp.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../types/common.type";

import Joi from "joi";

const router = Router();
const controller = new AuthController();

/**
 * =========================
 * Joi Validation Schemas
 * =========================
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const otpSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  code: Joi.string().length(6).required(),
});

/**
 * =========================
 * Routes
 * =========================
 */

// ✅ PUBLIC: Register user and send OTP
router.post(
  "/register",
  validate(registerSchema),
  controller.register
);

// ✅ PUBLIC: Login user and send OTP
router.post(
  "/login",
  validate(loginSchema),
  controller.login
);

// ✅ PUBLIC: Verify OTP and return JWT
router.post(
  "/verify-otp",
  validate(otpSchema),
  verifyOTP,
  controller.verifyOTP
);

/**
 * =========================
 * Protected Routes
 * =========================
 */

// 🔒 ADMIN only
router.get(
  "/admin-test",
  authenticate,
  authorize(UserRole.ADMIN),
  (req, res) => {
    res.json({ message: "Welcome ADMIN!" });
  }
);

/**
 * =========================
 * Swagger Documentation
 * =========================
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and send OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully and OTP sent
 *       400:
 *         description: Validation error or email already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and send OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */

export default router;
