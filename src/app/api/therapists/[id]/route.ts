import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const therapist = await prisma.therapist.findUnique({
      where: { id },
      include: {
        center: true,
        children: {
          include: {
            therapyPlans: {
              where: {
                isActive: true,
              },
            },
          },
        },
        sessions: {
          take: 10,
          orderBy: {
            sessionDate: "desc",
          },
        },
        _count: {
          select: {
            children: true,
            sessions: true,
          },
        },
      },
    });

    if (!therapist) {
      return NextResponse.json(
        { error: "الأخصائي غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(therapist);
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "فشل في جلب الأخصائي" },
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

    const therapist = await prisma.therapist.update({
      where: { id },
      data: body,
      include: {
        center: true,
      },
    });

    return NextResponse.json(therapist);
  } catch (error: any) {
    console.error("Error updating therapist:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الأخصائي غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث الأخصائي" },
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
    
    await prisma.therapist.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting therapist:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الأخصائي غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف الأخصائي" },
      { status: 500 }
    );
  }
}

