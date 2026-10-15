import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const { data, error } = await resend.emails.send({
    from: "CareerPilot <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "CareerPilot email test",
    html: "<h1>CareerPilot</h1><p>Resend email integration is working.</p>",
  });

  if (error) {
    console.error("Email failed:", error);
    process.exitCode = 1;
    return;
  }

  console.log("Email accepted by Resend:", data);
}

main().catch(console.error);