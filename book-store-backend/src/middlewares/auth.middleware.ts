import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { UserRole } from "../types/common.type";

/**
 * 🔐 Ensure JWT secret exists
 */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * 🧾 Custom JWT payload
 */
export interface JwtPayload extends DefaultJwtPayload {
  id: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * 🔑 Extend Express Request
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * 🔒 Authentication middleware
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Optional safety check
    if (!decoded.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
