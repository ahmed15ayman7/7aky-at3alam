import { Assessment, Child } from "@prisma/client";

export function generateDiagnosisPrompt(
  child: Child,
  assessment: Assessment
): string {
  return `أنت أخصائي نفسي وعلاج نطق خبير. قم بتحليل البيانات التالية وتقديم تشخيص دقيق للطفل.

## بيانات الطفل:
- الاسم: ${child.name}
- العمر: ${child.age} سنة
- الجنس: ${child.gender === "male" ? "ذكر" : "أنثى"}

## بيانات الأم والحمل:
- عمر الأم: ${assessment.motherAge || "غير محدد"}
- عدد الأخوة: ${assessment.siblingsCount || "غير محدد"}
- نوع الولادة: ${assessment.birthType || "غير محدد"}
- حوادث أثناء الحمل: ${assessment.hadIncidentsDuringPregnancy ? "نعم" : "لا"}
- حالة مشابهة في الأسرة: ${assessment.hasSimilarCaseInFamily ? "نعم" : "لا"}
- نقص أكسجين: ${assessment.hadOxygenDeficiency ? "نعم" : "لا"}

## تاريخ النمو:
- بداية المشي: ${assessment.walkingStartAge || "غير محدد"}
- بداية الجلوس: ${assessment.sittingStartAge || "غير محدد"}
- مشاكل سمعية: ${assessment.hasHearingProblems ? "نعم" : "لا"}
- زيارة طبيب أنف وأذن: ${assessment.visitedENTDoctor ? "نعم" : "لا"}

## الفحص العضوي:
- تشوهات الفك: ${assessment.jawDeformities ? "نعم" : "لا"}
- مشاكل سقف الحلق: ${assessment.palateIssue ? "نعم" : "لا"}
- رباط اللسان: ${assessment.tongueTie ? "نعم" : "لا"}
- إصابات الحنجرة: ${assessment.larynxInjuries ? "نعم" : "لا"}

## الأعراض المصاحبة:
- تبول لا إرادي: ${assessment.bedwetting ? "نعم" : "لا"}
- قلق: ${assessment.anxiety ? "نعم" : "لا"}
- نشاط زائد: ${assessment.hyperactivity ? "نعم" : "لا"}
- خوف: ${assessment.fear ? "نعم" : "لا"}
- خجل: ${assessment.shyness ? "نعم" : "لا"}
- تشتت: ${assessment.distracted ? "نعم" : "لا"}
${assessment.otherSymptoms ? `- أعراض أخرى مذكورة: ${Array.isArray(assessment.otherSymptoms) ? (assessment.otherSymptoms as any[]).join(", ") : ""}` : ""}

## التاريخ اللغوي:
- أول كلمة: ${assessment.firstWord || "غير محدد"}
- الكلمات المعروفة: ${assessment.knownWords || "غير محدد"}
- الكلمات المنطوقة: ${assessment.spokenWords || "غير محدد"}
- بداية الجملة: ${assessment.sentenceStart || "غير محدد"}
- جمل غير مفهومة: ${assessment.unclearSentences ? "نعم" : "لا"}

## نتائج الاختبارات:
- نسبة الذكاء: ${assessment.iqScore || "غير محدد"}
- العمر العقلي: ${assessment.mentalAge || "غير محدد"}
- العمر اللغوي: ${assessment.languageAge || "غير محدد"}

## الشكوى الرئيسية:
${assessment.chiefComplaint}

---

قم بتقديم تشخيص شامل ومفصل بالتنسيق التالي (JSON):

{
  "diagnosis": "التشخيص الطبي الدقيق (مثل: اضطراب طيف التوحد، تأخر لغوي، إلخ)",
  "confidence": رقم من 0 إلى 100 يمثل مستوى الثقة في التشخيص,
  "reasoning": "شرح مفصل للأسباب التي أدت لهذا التشخيص، مع الإشارة للأعراض والعلامات المميزة",
  "severity": "خفيف" أو "متوسط" أو "شديد",
  "recommendations": "توصيات أولية للعلاج"
}

يجب أن يكون التشخيص بالعربية ومبني على المعايير الطبية المعترف بها (DSM-5, ICD-11).`;
}

