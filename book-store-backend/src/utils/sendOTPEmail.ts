import nodemailer from "nodemailer";

export const sendOTPEmail = async (email: string, code: string) => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log(`Sending OTP ${code} to ${email} (simulated, no credentials set)`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Book Store Backend" <${EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${code}. It will expire in 10 minutes.`,
    html: `<p>Your OTP code is: <strong>${code}</strong></p><p>It will expire in 10 minutes.</p>`,
  });
};
