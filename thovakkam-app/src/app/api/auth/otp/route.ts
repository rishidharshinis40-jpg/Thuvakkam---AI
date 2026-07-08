import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { action, phone, code, name } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (action === "send") {
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        mockCode: "1234",
        user: {
          id: "demo-user",
          phone,
          name: name || "அன்பர்"
        }
      });
    }

    if (action === "verify") {
      if (code !== "1234") {
        return NextResponse.json(
          { error: "Invalid OTP. Please enter 1234." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: "demo-user",
          phone,
          name: name || "அன்பர்"
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}