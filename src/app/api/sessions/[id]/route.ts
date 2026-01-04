import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await prisma.session.findUnique({
      where: { id: id },
      include: {
        child: true,
        therapist: true,
        therapyPlan: {
          include: {
            stages: {
              include: {
                tasks: true,
              },
            },
          },
        },
        taskEvaluations: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "الجلسة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "فشل في جلب الجلسة" },
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
    const { taskEvaluations, generalNotes, overallProgress, ...sessionData } = body;

    // Update session
    const session = await prisma.session.update({
      where: { id: id },
      data: {
        ...sessionData,
        generalNotes,
        overallProgress,
      },
    });

    // Save task evaluations
    if (taskEvaluations && Array.isArray(taskEvaluations)) {
      for (const evaluation of taskEvaluations) {
        await prisma.sessionTaskEvaluation.upsert({
          where: {
            sessionId_taskId: {
              sessionId: id,
              taskId: evaluation.taskId,
            },
          },
          update: {
            score: evaluation.score,
            notes: evaluation.notes,
          },
          create: {
            sessionId: id,
            taskId: evaluation.taskId,
            score: evaluation.score,
            notes: evaluation.notes,
          },
        });
      }
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Error updating session:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "الجلسة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "فشل في تحديث الجلسة" },
      { status: 500 }
    );
  }
}

