import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { diagnosisFormSchema } from "@/lib/utils/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: id },
      include: {
        child: {
          include: {
            center: true,
            therapist: true,
          },
        },
        assessment: true,
      },
    });

    if (!diagnosis) {
      return NextResponse.json(
        { error: "التشخيص غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    return NextResponse.json(
      { error: "فشل في جلب التشخيص" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = diagnosisFormSchema.parse(body);

    const diagnosis = await prisma.diagnosis.update({
      where: { id: id },
      data: {
        ...validatedData,
        isAiApproved: true,
      },
      include: {
        child: true,
        assessment: true,
      },
    });

    return NextResponse.json(diagnosis);
  } catch (error: any) {
    console.error("Error updating diagnosis:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "التشخيص غير موجود" },
        { status: 404 }
      );
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث التشخيص" },
      { status: 500 }
    );
  }
}

