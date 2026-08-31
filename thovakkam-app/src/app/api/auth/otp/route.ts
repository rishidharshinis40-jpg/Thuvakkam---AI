import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

// Helper to create SMTP Transporter configured from environment variables
function getTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587");
  const secure = port === 465 || process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}


export async function POST(request: Request) {
  try {
    const { action, phone, code, name } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "மின்னஞ்சல் முகவரி தேவை." },
        { status: 400 }
      );
    }

    if (action === "send") {
      // 1. Generate 6-digit OTP code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

      // 2. Save or update code in SQLite
      await prisma.otpVerification.upsert({
        where: { email: phone },
        update: {
          code: generatedCode,
          expiresAt,
        },
        create: {
          email: phone,
          code: generatedCode,
          expiresAt,
        },
      });

      // 3. Send email using SMTP
      try {
        const user = process.env.SMTP_USER || process.env.EMAIL_USER;
        const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD;
        const from = process.env.SMTP_FROM || user;

        if (!user || !pass) {
          console.error("SMTP Error: SMTP_USER or SMTP_PASS environment variable is missing.");
          return NextResponse.json(
            { error: "மின்னஞ்சல் சேவை கட்டமைப்பு பிழை (SMTP credentials not configured in environment)." },
            { status: 500 }
          );
        }

        const transporter = getTransporter();

        await transporter.sendMail({
          from,
          to: phone,
          subject: "துவக்கம் AI - உங்களது கடவுச்சொல் (OTP)",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #2563eb; text-align: center; margin-bottom: 24px;">துவக்கம் AI</h2>
              <p style="font-size: 16px; color: #334155; line-height: 1.5;">வணக்கம்,</p>
              <p style="font-size: 16px; color: #334155; line-height: 1.5;">உங்கள் துவக்கம் AI கணக்கில் உள்நுழைய தேவையான 6-இலக்க கடவுச்சொல் (OTP) கீழே கொடுக்கப்பட்டுள்ளது:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #059669; background-color: #ecfdf5; padding: 12px 24px; border-radius: 8px; border: 1px solid #a7f3d0; display: inline-block;">${generatedCode}</span>
              </div>
              <p style="font-size: 14px; color: #64748b; text-align: center;">இந்த கடவுச்சொல் 5 நிமிடங்களுக்கு மட்டுமே செல்லுபடியாகும். தயவுசெய்து இதை யாருடனும் பகிர வேண்டாம்.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">துவக்கம் AI அசிஸ்டண்ட் குழு</p>
            </div>
          `,
        });
      } catch (mailError: any) {
        console.error("Nodemailer Mail Send Error:", mailError);
        return NextResponse.json(
          { error: `மின்னஞ்சல் அனுப்புவதில் பிழை: ${mailError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully via SMTP",
      });
    }

    if (action === "verify") {
      // 1. Fetch OTP record
      const otpRecord = await prisma.otpVerification.findUnique({
        where: { email: phone },
      });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "கடவுச்சொல் கோரிக்கை எதுவும் கண்டறியப்படவில்லை. புதிய கடவுச்சொல்லைப் பெறவும்." },
          { status: 400 }
        );
      }

      // 2. Validate code and expiration
      if (otpRecord.code !== code) {
        return NextResponse.json(
          { error: "தவறான கடவுச்சொல். தயவுசெய்து சரிபார்த்து மீண்டும் உள்ளிடவும்." },
          { status: 400 }
        );
      }

      if (new Date() > new Date(otpRecord.expiresAt)) {
        return NextResponse.json(
          { error: "மன்னிக்கவும், கடவுச்சொல்லின் காலம் முடிந்துவிட்டது. புதிய கடவுச்சொல்லைப் பெறவும்." },
          { status: 400 }
        );
      }

      // 3. Delete OTP record after verification
      await prisma.otpVerification.delete({
        where: { email: phone },
      });

      // 4. Find or create user in SQLite database matching email/phone column
      let user = await prisma.user.findUnique({
        where: { phone },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone,
            name: name || "அன்பர்",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name || "அன்பர்",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Backend Auth Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}