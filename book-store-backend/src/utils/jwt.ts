import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "../types/common.type";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const signOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

export interface JwtPayload {
  id: string;
  role: UserRole;
  isActive: boolean;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, signOptions);
};
