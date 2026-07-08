import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get user applications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        scheme: true
      },
      orderBy: { submittedAt: "desc" }
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new application and save user profile
export async function POST(request: Request) {
  try {
    const { userId, schemeId, documents, profileData } = await request.json() as {
      userId: string;
      schemeId: string;
      documents: string[]; // List of document filenames or paths
      profileData?: {
        name?: string;
        age?: number;
        gender?: string;
        district?: string;
        education?: string;
        occupation?: string;
        annualIncome?: number;
        disabilityStatus?: boolean;
        isStudent?: boolean;
        isFarmer?: boolean;
        isSeniorCitizen?: boolean;
      };
    };

    if (!userId || !schemeId) {
      return NextResponse.json({ error: "Missing userId or schemeId" }, { status: 400 });
    }

    // 1. Update user profile data from conversation if provided
    if (profileData) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: profileData.name,
          age: profileData.age,
          gender: profileData.gender,
          district: profileData.district,
          education: profileData.education,
          occupation: profileData.occupation,
          annualIncome: profileData.annualIncome,
          disabilityStatus: profileData.disabilityStatus,
          isStudent: profileData.isStudent,
          isFarmer: profileData.isFarmer,
          isSeniorCitizen: profileData.isSeniorCitizen,
        }
      });
    }

    // 2. Check if user already applied to this scheme
    const existing = await prisma.application.findFirst({
      where: { userId, schemeId }
    });

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: "நீங்கள் ஏற்கனவே இந்த திட்டத்திற்கு விண்ணப்பித்துள்ளீர்கள். (You have already applied for this scheme.)",
        application: existing
      });
    }

    // 3. Create the application
    const application = await prisma.application.create({
      data: {
        userId,
        schemeId,
        status: "pending",
        documents: JSON.stringify(documents || [])
      },
      include: {
        scheme: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! (Application submitted successfully!)",
      application 
    });

  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
