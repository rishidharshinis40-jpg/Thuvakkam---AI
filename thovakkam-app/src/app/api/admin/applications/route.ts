import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get applications with optional search and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const district = searchParams.get("district") || "";

    // Build the query options
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (district) {
      where.user = {
        district: {
          equals: district
        }
      };
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        {
          user: {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
              { district: { contains: search } }
            ]
          }
        },
        {
          scheme: {
            name: { contains: search }
          }
        }
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: true,
        scheme: true
      },
      orderBy: { submittedAt: "desc" }
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("Error fetching admin applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update application status (Reviewer Actions)
export async function POST(request: Request) {
  try {
    const { applicationId, status } = await request.json() as {
      applicationId: string;
      status: "pending" | "under_review" | "approved" | "rejected" | "documents_requested";
    };

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing applicationId or status" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        user: true,
        scheme: true
      }
    });

    // In a production app, we would queue a notification here (SMS or Push).
    // For this MVP, we save the status update, which will trigger the voice alert in the citizen's dashboard.
    return NextResponse.json({ 
      success: true, 
      message: `விண்ணப்ப நிலை வெற்றிகரமாக மாற்றப்பட்டது: ${status}`, 
      application 
    });

  } catch (error: any) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
