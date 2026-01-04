import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const totalChildren = await prisma.child.count();
    const totalSessions = await prisma.session.count();
    const activePlans = await prisma.therapyPlan.count({
      where: { isActive: true },
    });
    const centersCount = await prisma.center.count();

    return NextResponse.json({
      totalChildren,
      totalSessions,
      activePlans,
      centersCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "فشل في جلب الإحصائيات" },
      { status: 500 }
    );
  }
}

