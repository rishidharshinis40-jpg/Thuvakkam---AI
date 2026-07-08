import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { action, phone, code, name } = await request.json() as {
      action: "send" | "verify";
      phone: string;
      code?: string;
      name?: string;
    };

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (action === "send") {
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        user = await prisma.user.create({
          data: { 
            phone,
            name: name || "அன்பர் (User)"
          }
        });
      }

      // Mock sending OTP, returning it for easy validation
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent successfully (Mock Code: 1234)", 
        mockCode: "1234",
        user
      });
    }

    if (action === "verify") {
      if (!code) {
        return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
      }

      if (code !== "1234") {
        return NextResponse.json({ error: "Invalid verification code. Please enter 1234." }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Login successful", 
        user 
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Error in OTP API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
