import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json() as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    // Check credentials (plain text passwords seeded for development ease)
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        district: admin.district
      }
    });

  } catch (error: any) {
    console.error("Error in admin auth:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
