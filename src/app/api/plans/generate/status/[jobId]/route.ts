import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ✅ Job Status Polling Endpoint
 * GET /api/plans/generate/status/[jobId]
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { error: "معرف العملية مطلوب" },
        { status: 400 }
      );
    }

    // Fetch job status
    const job = await prisma.planGenerationJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        diagnosisId: true,
        childId: true,
        status: true,
        progress: true,
        currentStep: true,
        totalPlans: true,
        completedPlans: true,
        failedPlans: true,
        errorMessage: true,
        errorDetails: true,
        planIds: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "العملية غير موجودة" },
        { status: 404 }
      );
    }

    // Calculate duration
    const duration = job.completedAt
      ? Math.round(
          (job.completedAt.getTime() - job.createdAt.getTime()) / 1000
        )
      : job.startedAt
      ? Math.round((Date.now() - job.startedAt.getTime()) / 1000)
      : 0;

    return NextResponse.json(
      {
        job: {
          ...job,
          duration, // in seconds
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching job status:", error);
    return NextResponse.json(
      {
        error: "فشل في جلب حالة العملية",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

