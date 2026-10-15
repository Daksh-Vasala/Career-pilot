import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const sender = process.env.RESEND_FROM_EMAIL || "CareerPilot <onboarding@resend.dev>";

interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async ({
  to,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> => {
  const { error } = await resend.emails.send({
    from: sender,
    to: [to],
    subject: "Reset your CareerPilot password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your CareerPilot password.</p>
        <p>Click the button below to choose a new password. This link expires in 15 minutes.</p>
        <a
          href="${resetUrl}"
          style="display: inline-block; padding: 12px 20px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;"
        >
          Reset password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
