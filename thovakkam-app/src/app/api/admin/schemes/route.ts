import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// List all schemes (active and inactive) for admin
export async function GET() {
  try {
    const schemes = await prisma.scheme.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, schemes });
  } catch (error: any) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new scheme
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const {
      name,
      description,
      eligibilityRules,
      benefits,
      requiredDocuments,
      applicationProcedure,
      lastDate,
      department,
      officialLink,
      category,
      isActive
    } = data;

    if (!name || !description || !eligibilityRules || !benefits || !requiredDocuments || !applicationProcedure || !department || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scheme = await prisma.scheme.create({
      data: {
        name,
        description,
        eligibilityRules: typeof eligibilityRules === "string" ? eligibilityRules : JSON.stringify(eligibilityRules),
        benefits,
        requiredDocuments: typeof requiredDocuments === "string" ? requiredDocuments : JSON.stringify(requiredDocuments),
        applicationProcedure,
        lastDate,
        department,
        officialLink,
        category,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({ success: true, scheme });
  } catch (error: any) {
    console.error("Error creating scheme:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update existing scheme
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing scheme ID for update" }, { status: 400 });
    }

    if (updateData.eligibilityRules && typeof updateData.eligibilityRules !== "string") {
      updateData.eligibilityRules = JSON.stringify(updateData.eligibilityRules);
    }
    if (updateData.requiredDocuments && typeof updateData.requiredDocuments !== "string") {
      updateData.requiredDocuments = JSON.stringify(updateData.requiredDocuments);
    }

    const scheme = await prisma.scheme.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, scheme });
  } catch (error: any) {
    console.error("Error updating scheme:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Toggle scheme active status (soft delete)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing scheme ID for toggle" }, { status: 400 });
    }

    // Toggle active status
    const existing = await prisma.scheme.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    const scheme = await prisma.scheme.update({
      where: { id },
      data: { isActive: !existing.isActive }
    });

    return NextResponse.json({ 
      success: true, 
      message: `திட்டம் வெற்றிகரமாக ${scheme.isActive ? "செயல்படுத்தப்பட்டது" : "முடக்கப்பட்டது"}.`,
      scheme 
    });
  } catch (error: any) {
    console.error("Error toggling scheme status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
