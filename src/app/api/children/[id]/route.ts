import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { childFormSchema } from "@/lib/utils/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        center: true,
        therapist: true,
        assessments: {
          orderBy: { createdAt: "desc" },
        },
        diagnoses: {
          orderBy: { createdAt: "desc" },
          include: {
            assessment: true,
          },
        },
        therapyPlans: {
          orderBy: { createdAt: "desc" },
        },
        sessions: {
          orderBy: { sessionDate: "desc" },
          take: 10,
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "الطفل غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error("Error fetching child:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات الطفل" },
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
    const validatedData = childFormSchema.partial().parse(body);

    // Recalculate age if dateOfBirth is updated
    let age: number | undefined;
    if (validatedData.dateOfBirth) {
      age = Math.floor(
        (new Date().getTime() - validatedData.dateOfBirth.getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      );
    }

    const child = await prisma.child.update({
      where: { id },
      data: {
        ...validatedData,
        ...(age !== undefined && { age }),
      },
      include: {
        center: true,
        therapist: true,
      },
    });

    return NextResponse.json(child);
  } catch (error: any) {
    console.error("Error updating child:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الطفل غير موجود" },
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
      { error: "فشل في تحديث بيانات الطفل" },
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
    await prisma.child.delete({
      where: { id },
    });

    return NextResponse.json({ message: "تم حذف الطفل بنجاح" });
  } catch (error: any) {
    console.error("Error deleting child:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الطفل غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف الطفل" },
      { status: 500 }
    );
  }
}

