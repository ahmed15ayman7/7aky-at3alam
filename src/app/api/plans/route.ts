import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");
    const diagnosisId = searchParams.get("diagnosisId");

    const where: any = {};
    if (childId) where.childId = childId;
    if (diagnosisId) where.diagnosisId = diagnosisId;

    const plans = await prisma.therapyPlan.findMany({
      where,
      include: {
        stages: {
          include: {
            tasks: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        child: true,
        diagnosis: true,
      },
      orderBy: { planNumber: "asc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching therapy plans:", error);
    return NextResponse.json(
      { error: "فشل في جلب الخطط العلاجية" },
      { status: 500 }
    );
  }
}

