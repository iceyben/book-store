import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/user.validation.middleware";
import Joi from "joi";

const router = Router();
const controller = new AuthController();

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
  userId: Joi.string().required(),
  code: Joi.string().length(6).required(),
});

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/verify-otp", validate(otpSchema), controller.verifyOTP);

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user and send OTP
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Email already exists
 */

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login user and send OTP
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: OTP sent to email
 * 401:
 * description: Invalid credentials
 */

/**
 * @swagger
 * /auth/verify-otp:
 * post:
 * summary: Verify OTP and return JWT
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - userId
 * - code
 * properties:
 * userId:
 * type: string
 * code:
 * type: string
 * responses:
 * 200:
 * description: OTP verified successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * token:
 * type: string
 * 400:
 * description: Invalid or expired OTP
 */
export default router;