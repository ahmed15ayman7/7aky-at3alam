import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/ai/openai";
import { generateDiagnosisPrompt } from "@/lib/ai/prompts/diagnosis";

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { error: "معرف التقييم مطلوب" },
        { status: 400 }
      );
    }

    // Fetch assessment with child data
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        child: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "التقييم غير موجود" },
        { status: 404 }
      );
    }

    // Generate diagnosis prompt
    const prompt = generateDiagnosisPrompt(assessment.child, assessment);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت أخصائي نفسي وعلاج نطق خبير متخصص في تشخيص اضطرابات النمو والنطق لدى الأطفال.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Save diagnosis
    const diagnosis = await prisma.diagnosis.create({
      data: {
        childId: assessment.childId,
        assessmentId: assessment.id,
        aiSuggestedDiagnosis: result.diagnosis || "",
        aiConfidence: result.confidence || 0,
        aiReasoning: result.reasoning || "",
        finalDiagnosis: result.diagnosis || "",
        severityLevel: result.severity || "متوسط",
        isAiApproved: false,
      },
      include: {
        child: true,
        assessment: true,
      },
    });

    return NextResponse.json(diagnosis, { status: 201 });
  } catch (error: any) {
    console.error("Error generating diagnosis:", error);
    return NextResponse.json(
      {
        error: "فشل في توليد التشخيص",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

