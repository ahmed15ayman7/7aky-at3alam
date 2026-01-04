import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await prisma.therapyPlan.findUnique({
      where: { id: id },
      include: {
        stages: {
          include: {
            tasks: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        child: {
          include: {
            therapist: true,
          },
        },
        diagnosis: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "الخطة العلاجية غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching therapy plan:", error);
    return NextResponse.json(
      { error: "فشل في جلب الخطة العلاجية" },
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
    
    const plan = await prisma.therapyPlan.update({
      where: { id: id },
      data: {
        ...body,
        ...(body.planData && { planData: body.planData as any }),
      },
      include: {
        stages: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Error updating therapy plan:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الخطة العلاجية غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث الخطة العلاجية" },
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
    await prisma.therapyPlan.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "تم حذف الخطة بنجاح" });
  } catch (error: any) {
    console.error("Error deleting therapy plan:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الخطة العلاجية غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف الخطة العلاجية" },
      { status: 500 }
    );
  }
}

