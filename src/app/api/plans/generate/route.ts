import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/ai/openai";
import { generateTherapyPlanPrompt } from "@/lib/ai/prompts/therapy-plan";
import { generatePlanHtml } from "@/lib/ai/parsers/plan-parser";

export async function POST(request: NextRequest) {
  try {
    const { diagnosisId } = await request.json();

    if (!diagnosisId) {
      return NextResponse.json(
        { error: "معرف التشخيص مطلوب" },
        { status: 400 }
      );
    }

    // Fetch diagnosis with child data
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
      return NextResponse.json(
        { error: "التشخيص غير موجود" },
        { status: 404 }
      );
    }

    // Generate 4 therapy plans
    const plans = [];

    for (let i = 1; i <= 4; i++) {
      try {
        const prompt = generateTherapyPlanPrompt(diagnosis.child, diagnosis, i);

        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
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

        // Save plan
        const therapyPlan = await prisma.therapyPlan.create({
          data: {
            childId: diagnosis.childId,
            diagnosisId: diagnosis.id,
            planNumber: i,
            title: planData.title || `خطة علاجية ${i}`,
            generalGoal: planData.generalGoal || "",
            duration: planData.duration || "3 أشهر",
            planData: planData as any,
            planHtml: planHtml,
            isActive: i === 1, // First plan is active by default
            isAiGenerated: true,
          },
        });

        // Save stages and tasks
        for (const stageData of planData.stages || []) {
          const stage = await prisma.stage.create({
            data: {
              therapyPlanId: therapyPlan.id,
              stageNumber: stageData.stageNumber,
              title: stageData.title,
              period: stageData.period,
              description: stageData.description,
              order: stageData.stageNumber,
            },
          });

          // Save tasks
          for (let j = 0; j < (stageData.tasks || []).length; j++) {
            const taskData = stageData.tasks[j];
            await prisma.task.create({
              data: {
                stageId: stage.id,
                taskCode: taskData.taskCode,
                taskName: taskData.taskName,
                goal: taskData.goal,
                question: taskData.question,
                examples: taskData.examples,
                performanceCriteria: taskData.performanceCriteria,
                score: taskData.score || 0,
                notes: taskData.notes,
                order: j + 1,
              },
            });
          }
        }

        plans.push(therapyPlan);
      } catch (error) {
        console.error(`Error generating plan ${i}:`, error);
        // Continue with other plans even if one fails
      }
    }

    if (plans.length === 0) {
      return NextResponse.json(
        { error: "فشل في توليد الخطط" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `تم توليد ${plans.length} خطط بنجاح`,
        plans,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error generating therapy plans:", error);
    return NextResponse.json(
      {
        error: "فشل في توليد الخطط العلاجية",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

