import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePDF } from "@/lib/export/pdf-generator";
import { generateWordDocument } from "@/lib/export/word-generator";
import { Packer } from "docx";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { format } = await request.json();

    // Fetch plan with all relations
    const plan = await prisma.therapyPlan.findUnique({
      where: { id: id },
      include: {
        child: {
          include: {
            center: true,
            therapist: true,
          },
        },
        diagnosis: true,
        stages: {
          include: {
            tasks: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "الخطة غير موجودة" },
        { status: 404 }
      );
    }

    let buffer: Buffer;
    let mimeType: string;
    let filename: string;

    if (format === "pdf") {
      // Generate HTML from plan
      const html = generateHTMLFromPlan(plan);
      buffer = await generatePDF(html);
      mimeType = "application/pdf";
      filename = `plan-${plan.child.name}-${Date.now()}.pdf`;
    } else if (format === "word") {
      // Generate Word document
      const doc = generateWordDocument({
        childName: plan.child.name,
        therapistName: plan.child.therapist?.name || "",
        centerName: plan.child.center?.name || "",
        diagnosis: plan.diagnosis?.finalDiagnosis || "",
        generalGoal: plan.generalGoal || "",
        stages: plan.stages.map((stage) => ({
          title: stage.title,
          period: stage.period,
          tasks: stage.tasks.map((task) => ({
            taskCode: task.taskCode,
            taskName: task.taskName,
            goal: task.goal,
            question: task.question,
            examples: task.examples,
            performanceCriteria: task.performanceCriteria,
            score: task.score,
            notes: task.notes || "",
          })),
        })),
      });

      buffer = await Packer.toBuffer(doc);
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      filename = `plan-${plan.child.name}-${Date.now()}.docx`;
    } else {
      return NextResponse.json(
        { error: "صيغة غير مدعومة" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("therapy-plans")
      .upload(`${plan.childId}/${filename}`, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("فشل في رفع الملف");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("therapy-plans")
      .getPublicUrl(data.path);

    // Update plan with file URL
    await prisma.therapyPlan.update({
      where: { id: id },
      data: {
        exportedFileUrl: urlData.publicUrl,
      },
    });

    // Return file as download
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "فشل في تصدير الخطة" },
      { status: 500 }
    );
  }
}

function generateHTMLFromPlan(plan: any): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>برنامج علاجي فردي</title>
      <style>
        * { direction: rtl; text-align: right; }
        body { font-family: 'Cairo', Arial, sans-serif; margin: 40px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { text-align: center; color: #333; }
        .info { margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>برنامج علاجي فردي</h1>
      
      <div class="info">
        <p><strong>اسم الطفل:</strong> ${plan.child.name}</p>
        <p><strong>اسم الأخصائي:</strong> ${plan.child.therapist?.name || ""}</p>
        <p><strong>المركز:</strong> ${plan.child.center?.name || ""}</p>
        <p><strong>التشخيص:</strong> ${plan.diagnosis?.finalDiagnosis || ""}</p>
      </div>

      <h2>الهدف العام</h2>
      <p>${plan.generalGoal || ""}</p>

      ${plan.stages
        .map(
          (stage: any, idx: number) => `
        <h2>المرحلة ${idx + 1}: ${stage.title}</h2>
        <p><strong>المدة:</strong> ${stage.period}</p>
        
        <table>
          <thead>
            <tr>
              <th>كود</th>
              <th>المهمة</th>
              <th>الهدف</th>
              <th>السؤال</th>
              <th>أمثلة</th>
              <th>الدرجة</th>
            </tr>
          </thead>
          <tbody>
            ${stage.tasks
              .map(
                (task: any) => `
              <tr>
                <td>${task.taskCode}</td>
                <td>${task.taskName}</td>
                <td>${task.goal}</td>
                <td>${task.question}</td>
                <td>${task.examples}</td>
                <td>${task.score}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `
        )
        .join("")}
    </body>
    </html>
  `;
}

