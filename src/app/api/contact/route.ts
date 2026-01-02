import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Log the submission (in development)
    logger.info("Contact form submission", { email });

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'taylor@odisai.com',
    //   subject: 'New Contact Form Submission',
    //   html: `<p>New contact from: ${email}</p>`
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Contact form error", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
