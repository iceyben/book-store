import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email: string, code: string) => {
  console.log(`Attempting to send OTP to ${email}...`); // Log attempt
  
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is missing from .env");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<strong>${code}</strong>`,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return;
    }
    console.log("✅ Email sent successfully:", data?.id);
  } catch (err) {
    console.error("❌ Unexpected error sending email:", err);
  }
};
