import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  try {
    const { id, stageId } = await params;
    const body = await request.json();

    const stage = await prisma.stage.update({
      where: { id: stageId },
      data: body,
    });

    return NextResponse.json(stage);
  } catch (error: any) {
    console.error("Error updating stage:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "المرحلة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث المرحلة" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  try {
    const { id, stageId } = await params;
    await prisma.stage.delete({
      where: { id: stageId },
    });

    return NextResponse.json({ message: "تم حذف المرحلة بنجاح" });
  } catch (error: any) {
    console.error("Error deleting stage:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "المرحلة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف المرحلة" },
      { status: 500 }
    );
  }
}

