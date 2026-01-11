import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/ai/openai";
import { generateTherapyPlanPrompt } from "@/lib/ai/prompts/therapy-plan";
import { generatePlanHtml } from "@/lib/ai/parsers/plan-parser";

interface GeneratePlansJobData {
  jobId: string;
  diagnosisId: string;
}

interface PlanGenerationResult {
  planNumber: number;
  success: boolean;
  planId?: string;
  error?: string;
}

/**
 * ✅ Optimized Plan Generator with Parallelization & Bulk Operations
 */
export async function generateTherapyPlansAsync({
  jobId,
  diagnosisId,
}: GeneratePlansJobData): Promise<void> {
  try {
    // 1. Update job status to processing
    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        status: "processing",
        startedAt: new Date(),
        currentStep: "Fetching diagnosis data...",
        progress: 5,
      },
    });

    // 2. Fetch diagnosis with child data
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: diagnosisId },
      include: {
        child: {
          include: {
            therapist: true,
          },
        },
      },
    });

    if (!diagnosis) {
      throw new Error("التشخيص غير موجود");
    }

    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        currentStep: "Generating 4 therapy plans in parallel...",
        progress: 10,
      },
    });

    // 3. ✅ Generate all 4 plans in PARALLEL (not sequential)
    const planPromises = [1, 2, 3, 4].map((planNumber) =>
      generateSinglePlan(diagnosis, planNumber, jobId)
    );

    const planResults = await Promise.allSettled(planPromises);

    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        currentStep: "AI generation completed. Saving to database...",
        progress: 60,
      },
    });

    // 4. Process results
    const successfulPlans: PlanGenerationResult[] = [];
    const failedPlans: PlanGenerationResult[] = [];

    planResults.forEach((result, index) => {
      const planNumber = index + 1;
      if (result.status === "fulfilled") {
        successfulPlans.push({
          planNumber,
          success: true,
          planId: result.value.planId,
        });
      } else {
        failedPlans.push({
          planNumber,
          success: false,
          error: result.reason?.message || "Unknown error",
        });
      }
    });

    if (successfulPlans.length === 0) {
      throw new Error("فشل في توليد جميع الخطط");
    }

    // 5. ✅ Save all plans to database using TRANSACTIONS
    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        currentStep: `Saving ${successfulPlans.length} plans to database...`,
        progress: 70,
      },
    });

    const savedPlanIds = await savePlansToDatabase(
      successfulPlans,
      diagnosis,
      jobId
    );

    // 6. Update job as completed
    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        status: "completed",
        progress: 100,
        completedPlans: successfulPlans.length,
        failedPlans: failedPlans.length,
        planIds: savedPlanIds,
        currentStep: "Completed successfully!",
        completedAt: new Date(),
        errorDetails:
          failedPlans.length > 0
            ? { failedPlans: failedPlans.map((p) => ({ planNumber: p.planNumber, error: p.error })) }
            : {},
      },
    });
  } catch (error: any) {
    console.error("Plan generation job failed:", error);

    // Update job as failed
    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorMessage: error.message || "Unknown error",
        errorDetails: { stack: error.stack },
        completedAt: new Date(),
      },
    });

    throw error;
  }
}

/**
 * ✅ Generate a single plan (called in parallel)
 */
async function generateSinglePlan(diagnosis: any, planNumber: number, jobId: string) {
  try {
    const prompt = generateTherapyPlanPrompt(
      diagnosis.child,
      diagnosis,
      planNumber
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت أخصائي علاج نطق وتأهيل خبير متخصص في إنشاء خطط علاجية مفصلة للأطفال.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const planData = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Generate HTML
    const planHtml = generatePlanHtml(
      planData,
      diagnosis.child.name,
      diagnosis.child.therapist.name
    );

    // Update progress
    const progressIncrement = 12.5; // 50% / 4 plans
    await prisma.planGenerationJob.update({
      where: { id: jobId },
      data: {
        progress: {
          increment: progressIncrement,
        },
        currentStep: `Generated plan ${planNumber}/4`,
      },
    });

    return {
      planNumber,
      planData,
      planHtml,
      planId: "", // Will be assigned when saved to DB
    };
  } catch (error: any) {
    console.error(`Error generating plan ${planNumber}:`, error);
    throw error;
  }
}

/**
 * ✅ Save all plans to database using BULK operations & TRANSACTIONS
 */
async function savePlansToDatabase(
  plans: any[],
  diagnosis: any,
  jobId: string
): Promise<string[]> {
  const planIds: string[] = [];

  // Use transaction for atomicity
  await prisma.$transaction(async (tx) => {
    for (const plan of plans) {
      const planData = plan.planData;
      const planHtml = plan.planHtml;

      // Create therapy plan
      const therapyPlan = await tx.therapyPlan.create({
        data: {
          childId: diagnosis.childId,
          diagnosisId: diagnosis.id,
          planNumber: plan.planNumber,
          title: planData.title || `خطة علاجية ${plan.planNumber}`,
          generalGoal: planData.generalGoal || "",
          duration: planData.duration || "3 أشهر",
          planData: planData as any,
          planHtml: planHtml,
          isActive: plan.planNumber === 1, // First plan is active by default
          isAiGenerated: true,
        },
      });

      planIds.push(therapyPlan.id);

      // ✅ Prepare bulk data for stages and tasks
      const stagesToCreate: any[] = [];
      const tasksToCreateLater: any[] = [];

      for (const stageData of planData.stages || []) {
        // We'll create stages first, then tasks
        stagesToCreate.push({
          therapyPlanId: therapyPlan.id,
          stageNumber: stageData.stageNumber,
          title: stageData.title,
          period: stageData.period,
          description: stageData.description,
          order: stageData.stageNumber,
        });

        // Store tasks for later (after we have stage IDs)
        tasksToCreateLater.push({
          stageNumber: stageData.stageNumber,
          tasks: stageData.tasks || [],
        });
      }

      // ✅ Bulk create stages (3 at once instead of 3 separate queries)
      const createdStages = await tx.stage.createManyAndReturn({
        data: stagesToCreate,
      });

      // ✅ Now prepare bulk tasks with correct stage IDs
      const allTasksToCreate: any[] = [];

      createdStages.forEach((stage, stageIndex) => {
        const stageTasks = tasksToCreateLater[stageIndex].tasks;

        stageTasks.forEach((taskData: any, taskIndex: number) => {
          allTasksToCreate.push({
            stageId: stage.id,
            taskCode: taskData.taskCode,
            taskName: taskData.taskName,
            goal: taskData.goal,
            question: taskData.question,
            examples: taskData.examples,
            performanceCriteria: taskData.performanceCriteria,
            score: taskData.score || 0,
            notes: taskData.notes,
            order: taskIndex + 1,
          });
        });
      });

      // ✅ Bulk create ALL tasks at once (57 tasks in 1 query instead of 57 queries!)
      if (allTasksToCreate.length > 0) {
        await tx.task.createMany({
          data: allTasksToCreate,
        });
      }

      // Update job progress
      await tx.planGenerationJob.update({
        where: { id: jobId },
        data: {
          progress: {
            increment: 7.5, // 30% / 4 plans
          },
          currentStep: `Saved plan ${plan.planNumber}/4 to database`,
        },
      });
    }
  });

  return planIds;
}

