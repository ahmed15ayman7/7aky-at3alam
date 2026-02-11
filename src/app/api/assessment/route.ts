import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assessmentFormSchema } from "@/lib/utils/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, ...assessmentData } = body;

    if (!childId) {
      return NextResponse.json(
        { error: "معرف الطفل مطلوب" },
        { status: 400 }
      );
    }

    const validatedData = assessmentFormSchema.parse(assessmentData);

    const assessment = await prisma.assessment.create({
      data: {
        childId,
        ...validatedData,
        receptiveLanguage: validatedData.receptiveLanguage as any,
        weaknessAreas: validatedData.weaknessAreas as any,
        otherSymptoms: validatedData.otherSymptoms as any,
      },
      include: {
        child: true,
      },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating assessment:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل في إنشاء التقييم" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");

    const where: any = {};
    if (childId) where.childId = childId;

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        child: true,
        diagnosis: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "فشل في جلب التقييمات" },
      { status: 500 }
    );
  }
}

