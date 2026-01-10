import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, code } = req.body;

  // ✅ FIX: use `code`, not `otp`
  if (!userId || !code) {
    return res.status(400).json({ message: "userId and OTP required" });
  }

  try {
    const result = await authService.verifyOTP(userId, code);

    // ✅ Attach token so controller can return it
    res.locals.token = result.token;

    next();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
