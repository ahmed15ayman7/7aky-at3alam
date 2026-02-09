import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // إنشاء prompt للذكاء الاصطناعي لحساب الأعمار
    const prompt = `أنت أخصائي تخاطب وتأهيل خبير. بناءً على البيانات التقييمية التالية للطفل، قم بتقدير العمر العقلي (Mental Age) والعمر اللغوي (Language Age) بدقة.

## بيانات الطفل:

### التاريخ اللغوي:
- أول كلمة: ${data.firstWord || "غير محدد"}
- الكلمات المعروفة: ${data.knownWords || "غير محدد"}
- الكلمات المنطوقة: ${data.spokenWords || "غير محدد"}
- بداية تكوين الجمل: ${data.sentenceStart || "غير محدد"}
- جمل غير واضحة: ${data.unclearSentences ? "نعم" : "لا"}

### اللغة الاستقبالية:
- أجزاء الجسم: ${data.receptiveLanguage?.bodyParts?.length || 0} عنصر (${data.receptiveLanguage?.bodyParts?.join(", ") || "لا شيء"})
- الحيوانات: ${data.receptiveLanguage?.animals?.length || 0} عنصر (${data.receptiveLanguage?.animals?.join(", ") || "لا شيء"})
- الخضروات: ${data.receptiveLanguage?.vegetables?.length || 0} عنصر (${data.receptiveLanguage?.vegetables?.join(", ") || "لا شيء"})
- الأثاث: ${data.receptiveLanguage?.furniture?.length || 0} عنصر (${data.receptiveLanguage?.furniture?.join(", ") || "لا شيء"})
- الأدوات: ${data.receptiveLanguage?.tools?.length || 0} عنصر (${data.receptiveLanguage?.tools?.join(", ") || "لا شيء"})
- الألوان: ${data.receptiveLanguage?.colors?.length || 0} عنصر (${data.receptiveLanguage?.colors?.join(", ") || "لا شيء"})

### تاريخ النمو:
- بدء المشي: ${data.walkingStartAge || "غير محدد"}
- بدء الجلوس: ${data.sittingStartAge || "غير محدد"}
- مشاكل سمعية: ${data.hasHearingProblems ? "نعم" : "لا"}

### الأعراض المصاحبة:
- القلق: ${data.anxiety ? "نعم" : "لا"}
- فرط الحركة: ${data.hyperactivity ? "نعم" : "لا"}
- التشتت: ${data.distracted ? "نعم" : "لا"}
- الخجل: ${data.shyness ? "نعم" : "لا"}

### نسبة الذكاء (إن وجدت):
${data.iqScore ? `- IQ Score: ${data.iqScore}` : "- غير محدد"}

### الشكوى الرئيسية:
${data.chiefComplaint || "غير محدد"}

## المطلوب:
بناءً على المعلومات أعلاه:
1. قدّر **العمر العقلي (Mental Age)** بدقة (مثال: "4 سنوات" أو "5 سنوات ونصف")
2. قدّر **العمر اللغوي (Language Age)** بدقة (مثال: "3 سنوات" أو "4 سنوات ونصف")

**ملاحظات مهمة:**
- استخدم المعايير العلمية للتطور اللغوي والعقلي
- ركز على:
  * عدد الكلمات المعروفة والمنطوقة
  * القدرة على تكوين الجمل
  * اتساع المفردات في اللغة الاستقبالية
  * تطور المهارات الحركية (المشي، الجلوس)
  * نسبة الذكاء إن وجدت
- العمر اللغوي قد يكون أقل أو أكثر من العمر العقلي
- كن دقيقاً ومهنياً في التقدير

**الرد يجب أن يكون بصيغة JSON فقط كالتالي:**
{
  "mentalAge": "العمر العقلي المقدر",
  "languageAge": "العمر اللغوي المقدر",
  "reasoning": "تفسير مختصر للتقدير"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت أخصائي تخاطب وتأهيل خبير متخصص في تقييم النمو العقلي واللغوي للأطفال.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // دقة أعلى
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    return NextResponse.json({
      mentalAge: result.mentalAge || "غير محدد",
      languageAge: result.languageAge || "غير محدد",
      reasoning: result.reasoning,
    });
  } catch (error: any) {
    console.error("Error calculating ages:", error);
    return NextResponse.json(
      {
        error: "فشل في حساب الأعمار",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
