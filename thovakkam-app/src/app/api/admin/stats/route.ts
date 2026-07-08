import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Total counts
    const totalUsers = await prisma.user.count();
    const totalApplications = await prisma.application.count();

    // 2. Applications by status
    const statusGroups = await prisma.application.groupBy({
      by: ["status"],
      _count: {
        id: true
      }
    });

    const statusCounts = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      documents_requested: 0
    };

    statusGroups.forEach((group) => {
      const status = group.status as keyof typeof statusCounts;
      if (statusCounts[status] !== undefined) {
        statusCounts[status] = group._count.id;
      }
    });

    // 3. Most popular schemes (top 5)
    const apps = await prisma.application.findMany({
      include: {
        scheme: true
      }
    });

    const schemeCountMap: Record<string, { name: string; count: number }> = {};
    apps.forEach((app) => {
      if (!schemeCountMap[app.schemeId]) {
        schemeCountMap[app.schemeId] = {
          name: app.scheme.name,
          count: 0
        };
      }
      schemeCountMap[app.schemeId].count += 1;
    });

    const popularSchemes = Object.values(schemeCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. District-wise user counts
    const districtGroups = await prisma.user.groupBy({
      by: ["district"],
      _count: {
        id: true
      }
    });

    const districtStats = districtGroups
      .filter((g) => g.district !== null)
      .map((g) => ({
        district: g.district,
        count: g._count.id
      }))
      .sort((a, b) => b.count - a.count);

    // 5. Category-wise scheme counts
    const categoryGroups = await prisma.scheme.groupBy({
      by: ["category"],
      _count: {
        id: true
      }
    });

    const categoryStats = categoryGroups.map((g) => ({
      category: g.category,
      count: g._count.id
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalApplications,
        statusCounts,
        popularSchemes,
        districtStats,
        categoryStats
      }
    });

  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
