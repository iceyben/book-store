import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { UserRole as PrismaUserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utils/sendOTPEmail";
import { UserRole } from "../types/common.type";

interface RegisterDto { name: string; email: string; password: string; }
interface LoginDto { email: string; password: string; }

export class AuthService {
  generateToken(user: { id: string; role: UserRole; isActive: boolean }) {
    return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "1d" });
  }

  register = async (data: RegisterDto) => {
    const email = data.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email,
        password: hashedPassword,
        role: PrismaUserRole.USER as any,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.oTP.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOTPEmail(user.email, otp);
    return { message: "User registered. Check email for OTP.", userId: user.id };
  };

  login = async (data: LoginDto) => {
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.oTP.create({
      data: { code: otp, userId: user.id, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });

    await sendOTPEmail(user.email, otp);
    return { message: "OTP sent to email", userId: user.id };
  };

  // This method is used if you want to verify inside the controller directly
  verifyOTP = async (userId: string, code: string) => {
    const otpRecord = await prisma.oTP.findFirst({ where: { userId, code } });
    if (!otpRecord) throw new Error("Invalid OTP");
    if (otpRecord.expiresAt < new Date()) throw new Error("OTP expired");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    await prisma.oTP.delete({ where: { id: otpRecord.id } });

    const token = this.generateToken({
      id: user.id,
      role: user.role as UserRole,
      isActive: user.isActive,
    });

    return { message: "OTP verified successfully", token };
  };
}