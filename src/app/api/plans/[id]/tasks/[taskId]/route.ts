import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    const body = await request.json();

    const task = await prisma.task.update({
      where: { id: taskId },
      data: body,
    });

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Error updating task:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث المهمة" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "تم حذف المهمة بنجاح" });
  } catch (error: any) {
    console.error("Error deleting task:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في حذف المهمة" },
      { status: 500 }
    );
  }
}

