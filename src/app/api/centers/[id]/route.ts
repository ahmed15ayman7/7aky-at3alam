import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const center = await prisma.center.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            therapist: true,
            therapyPlans: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!center) {
      return NextResponse.json(
        { error: "المركز غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(center);
  } catch (error) {
    console.error("Error fetching center:", error);
    return NextResponse.json(
      { error: "فشل في جلب المركز" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const center = await prisma.center.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(center);
  } catch (error: any) {
    console.error("Error updating center:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "المركز غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث المركز" },
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
    await prisma.center.delete({
      where: { id },
    });

    return NextResponse.json({ message: "تم حذف المركز بنجاح" });
  } catch (error: any) {
    console.error("Error deleting center:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "المركز غير موجود" },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "لا يمكن حذف المركز لوجود أطفال مسجلين فيه" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف المركز" },
      { status: 500 }
    );
  }
}

