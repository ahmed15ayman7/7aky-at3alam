import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, therapyPlanId, therapistId, sessionDate, duration, activities } = body;

    if (!childId || !therapistId) {
      return NextResponse.json(
        { error: "معرف الطفل والأخصائي مطلوبان" },
        { status: 400 }
      );
    }

    // Get session number
    const sessionsCount = await prisma.session.count({
      where: { childId },
    });

    const session = await prisma.session.create({
      data: {
        childId,
        therapyPlanId,
        therapistId,
        sessionNumber: sessionsCount + 1,
        sessionDate: new Date(sessionDate),
        duration: duration || 45,
        activities: activities as any,
      },
      include: {
        child: true,
        therapist: true,
        therapyPlan: true,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء الجلسة" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");
    const therapyPlanId = searchParams.get("therapyPlanId");

    const where: any = {};
    if (childId) where.childId = childId;
    if (therapyPlanId) where.therapyPlanId = therapyPlanId;

    const sessions = await prisma.session.findMany({
      where,
      include: {
        child: true,
        therapist: true,
        therapyPlan: true,
        taskEvaluations: {
          include: {
            task: true,
          },
        },
      },
      orderBy: { sessionDate: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "فشل في جلب الجلسات" },
      { status: 500 }
    );
  }
}

