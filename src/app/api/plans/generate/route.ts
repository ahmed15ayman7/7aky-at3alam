import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTherapyPlansAsync } from "@/lib/jobs/plan-generator";

/**
 * ✅ Optimized API Route - Async Job Initiator
 * 
 * Changes:
 * - No longer waits for plan generation (returns immediately)
 * - Creates a job and processes it in background
 * - Client polls /api/plans/generate/status/[jobId] for updates
 * - Reduces timeout risk from 250-350s to <2s
 */
export async function POST(request: NextRequest) {
  try {
    const { diagnosisId } = await request.json();

    if (!diagnosisId) {
      return NextResponse.json(
        { error: "معرف التشخيص مطلوب" },
        { status: 400 }
      );
    }

    // 1. Verify diagnosis exists
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: diagnosisId },
      select: { id: true, childId: true },
    });

    if (!diagnosis) {
      return NextResponse.json(
        { error: "التشخيص غير موجود" },
        { status: 404 }
      );
    }

    // 2. Check if there's already a running job for this diagnosis
    const existingJob = await prisma.planGenerationJob.findFirst({
      where: {
        diagnosisId,
        status: { in: ["pending", "processing"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingJob) {
      return NextResponse.json(
        {
          message: "يوجد بالفعل عملية توليد قيد التنفيذ",
          jobId: existingJob.id,
          status: existingJob.status,
          progress: existingJob.progress,
        },
        { status: 200 }
      );
    }

    // 3. Create a new job
    const job = await prisma.planGenerationJob.create({
      data: {
        diagnosisId,
        childId: diagnosis.childId,
        status: "pending",
        progress: 0,
        currentStep: "Initializing...",
      },
    });

    // 4. ✅ Start background processing (non-blocking)
    // This runs independently and doesn't block the response
    generateTherapyPlansAsync({
      jobId: job.id,
      diagnosisId,
    }).catch((error) => {
      console.error("Background job failed:", error);
      // Error is already handled in the generator function
    });

    // 5. Return immediately with job ID
    return NextResponse.json(
      {
        message: "بدأت عملية توليد الخطط العلاجية",
        jobId: job.id,
        status: "pending",
        progress: 0,
        pollUrl: `/api/plans/generate/status/${job.id}`,
      },
      { status: 202 } // 202 Accepted
    );
  } catch (error: any) {
    console.error("Error initiating plan generation:", error);
    return NextResponse.json(
      {
        error: "فشل في بدء توليد الخطط العلاجية",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
