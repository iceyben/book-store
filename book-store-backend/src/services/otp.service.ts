import nodemailer from "nodemailer";

// Temporary in-memory store for OTPs
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class OTPService {
  // Generate 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to email
  static async sendOTP(email: string): Promise<string> {
    const otp = OTPService.generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

    await transporter.sendMail({
      from: `"Bookstore OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
    });

    return otp;
  }

  // Verify OTP
  static verifyOTP(email: string, otp: string): boolean {
    const record = otpStore[email];
    if (!record) return false;
    if (record.expiresAt < Date.now()) {
      delete otpStore[email];
      return false;
    }
    const isValid = record.otp === otp;
    if (isValid) delete otpStore[email]; // consume OTP
    return isValid;
  }
}
