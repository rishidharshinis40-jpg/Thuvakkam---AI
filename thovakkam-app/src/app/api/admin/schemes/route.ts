import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper to validate scheme input fields
function validateSchemeInput(requiredDocuments?: any, officialLink?: any) {
  let validatedDocs: string[] | undefined = undefined;

  if (requiredDocuments !== undefined) {
    let parsedDocs: string[] = [];
    if (typeof requiredDocuments === "string") {
      try {
        parsedDocs = JSON.parse(requiredDocuments);
      } catch (e) {
        return { error: "Required Documents must be a valid JSON array" };
      }
    } else if (Array.isArray(requiredDocuments)) {
      parsedDocs = requiredDocuments;
    } else {
      return { error: "Required Documents must be an array" };
    }

    const tempDocs: string[] = [];
    for (const doc of parsedDocs) {
      if (typeof doc !== "string") {
        return { error: "Each document must be a string" };
      }
      const trimmed = doc.trim();
      if (!trimmed) {
        return { error: "Document name cannot be empty" };
      }
      if (!tempDocs.includes(trimmed)) {
        tempDocs.push(trimmed);
      }
    }
    validatedDocs = tempDocs;
  }

  if (officialLink !== undefined && officialLink !== null) {
    if (typeof officialLink !== "string") {
      return { error: "Official Link must be a string" };
    }
    const trimmedLink = officialLink.trim();
    if (trimmedLink) {
      try {
        const url = new URL(trimmedLink);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
          return { error: "Official Link protocol must be HTTP or HTTPS" };
        }
        const lowerLink = trimmedLink.toLowerCase();
        if (
          lowerLink.includes("javascript:") ||
          lowerLink.includes("data:") ||
          lowerLink.includes("vbscript:")
        ) {
          return { error: "Unsafe protocol detected in Official Link" };
        }
      } catch (e) {
        return { error: "Official Link must be a valid URL" };
      }
    }
  }

  return { validatedDocs };
}

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

    const validation = validateSchemeInput(requiredDocuments, officialLink);
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const scheme = await prisma.scheme.create({
      data: {
        name,
        description,
        eligibilityRules: typeof eligibilityRules === "string" ? eligibilityRules : JSON.stringify(eligibilityRules),
        benefits,
        requiredDocuments: JSON.stringify(validation.validatedDocs),
        applicationProcedure,
        lastDate,
        department,
        officialLink: officialLink ? officialLink.trim() : null,
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

    const validation = validateSchemeInput(updateData.requiredDocuments, updateData.officialLink);
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (updateData.eligibilityRules && typeof updateData.eligibilityRules !== "string") {
      updateData.eligibilityRules = JSON.stringify(updateData.eligibilityRules);
    }

    if (validation.validatedDocs !== undefined) {
      updateData.requiredDocuments = JSON.stringify(validation.validatedDocs);
    } else if (updateData.requiredDocuments !== undefined) {
      // Fallback if requiredDocuments was passed in some other valid structure
      updateData.requiredDocuments = typeof updateData.requiredDocuments === "string" 
        ? updateData.requiredDocuments 
        : JSON.stringify(updateData.requiredDocuments);
    }

    if (updateData.officialLink !== undefined) {
      updateData.officialLink = updateData.officialLink ? updateData.officialLink.trim() : null;
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
