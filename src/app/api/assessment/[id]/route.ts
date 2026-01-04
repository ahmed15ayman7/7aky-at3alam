import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assessmentFormSchema } from "@/lib/utils/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        child: {
          include: {
            center: true,
            therapist: true,
          },
        },
        diagnosis: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "التقييم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: "فشل في جلب التقييم" },
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

    // Validate input
    const validatedData = assessmentFormSchema.parse(body);

    const assessment = await prisma.assessment.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(assessment);
  } catch (error: any) {
    console.error("Error updating assessment:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "التقييم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث التقييم" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.assessment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "تم حذف التقييم بنجاح" });
  } catch (error: any) {
    console.error("Error deleting assessment:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "التقييم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف التقييم" },
      { status: 500 }
    );
  }
}
