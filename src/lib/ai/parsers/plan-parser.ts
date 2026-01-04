import { PlanData } from "@/types/plan";

export function generatePlanHtml(
  planData: PlanData,
  childName: string,
  therapistName: string
): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${planData.title}</title>
  <style>
    body {
      font-family: "Cairo", "Tahoma", sans-serif;
      background: #fff;
      color: #333;
      margin: 40px;
      line-height: 1.9;
    }

    .container {
      max-width: 900px;
      margin: auto;
      border: 2px solid #cebc09;
      border-radius: 12px;
      padding: 32px;
    }

    .header {
      text-align: center;
      border-bottom: 3px solid #cebc09;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #cebc09;
      margin: 0;
      font-size: 28px;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      background: #fff8e1;
      color: #333;
      padding: 10px 15px;
      border-radius: 8px;
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 18px;
      border-right: 5px solid #cebc09;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .info-box {
      background: #fff8e1;
      padding: 12px;
      border-radius: 8px;
      border-right: 5px solid #cebc09;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 20px;
    }

    table th {
      background: #cebc09;
      color: #333;
      padding: 10px;
      text-align: center;
    }

    table td {
      border: 1px solid #ddd;
      padding: 10px;
      background: #fff8e1;
      vertical-align: top;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px dashed #cebc09;
      font-size: 14px;
      color: #555;
    }

    .signature {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
    }

    .signature div {
      width: 45%;
      border-top: 1px solid #999;
      text-align: center;
      padding-top: 10px;
    }

    hr {
      border: none;
      border-top: 2px solid #cebc09;
      margin: 30px 0;
    }
  </style>
</head>

<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <h1>${planData.title}</h1>
    <p>لطفل اضطراب طيف التوحد (ASD)</p>
  </div>

  <!-- BASIC INFO -->
  <div class="section">
    <div class="section-title">البيانات الأساسية</div>
    <div class="info-grid">
      <div class="info-box">اسم الطفل: ${childName}</div>
      <div class="info-box">اسم الأخصائي: ${therapistName}</div>
      <div class="info-box">مدة البرنامج: ${planData.duration}</div>
      <div class="info-box">تاريخ التقييم: ${new Date().toLocaleDateString("ar-EG")}</div>
    </div>
  </div>

  <!-- GOAL -->
  <div class="section">
    <div class="section-title">الهدف العلاجي العام</div>
    <p>${planData.generalGoal}</p>
  </div>

  <!-- PHASES OVERVIEW -->
  <div class="section">
    <div class="section-title">الخطة العلاجية المرحلية</div>
    ${planData.stages.map((stage) => `
      <p><b>المرحلة ${stage.stageNumber}:</b> ${stage.title} (${stage.period})</p>
    `).join("")}
  </div>

  <!-- DETAILED PHASES -->
  ${planData.stages.map((stage) => `
    <div class="section">
      <hr />
      <div class="section-title">المرحلة ${stage.stageNumber}: ${stage.title}</div>
      <p><b>الفترة:</b> ${stage.period}</p>
      ${stage.description ? `<p>${stage.description}</p>` : ""}
      
      <table>
        <thead>
          <tr>
            <th>كود</th>
            <th>المهمة</th>
            <th>الهدف</th>
            <th>السؤال</th>
            <th>أمثلة</th>
            <th>محكات الأداء</th>
            <th>الدرجة</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          ${stage.tasks.map((task) => `
            <tr>
              <td><b>${task.taskCode}</b></td>
              <td>${task.taskName}</td>
              <td>${task.goal}</td>
              <td>${task.question}</td>
              <td>${task.examples}</td>
              <td style="white-space: pre-line;">${task.performanceCriteria}</td>
              <td style="text-align: center;"><b>${task.score}</b></td>
              <td>${task.notes || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `).join("")}

  <!-- SESSION MODEL -->
  <div class="section">
    <hr />
    <div class="section-title">نموذج الجلسة العلاجية</div>
    <table>
      <thead>
        <tr>
          <th>المدة</th>
          <th>النشاط</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${planData.sessionModel.freePlay} دقائق</td>
          <td>لعب حر موجه</td>
        </tr>
        <tr>
          <td>${planData.sessionModel.coreSkill} دقيقة</td>
          <td>تدريب مهارة أساسية</td>
        </tr>
        <tr>
          <td>${planData.sessionModel.interactive} دقائق</td>
          <td>نشاط تفاعلي</td>
        </tr>
        <tr>
          <td>${planData.sessionModel.reinforcement} دقائق</td>
          <td>تعزيز وإنهاء الجلسة</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- EVALUATION -->
  <div class="section">
    <div class="section-title">محكات التقييم والمتابعة</div>
    <ul>
      ${planData.evaluationCriteria.map((criterion) => `<li>${criterion}</li>`).join("")}
    </ul>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>
      هذا البرنامج العلاجي إرشادي وقابل للتعديل وفق استجابة الطفل
      وتقدير الأخصائي المعالج.
    </p>

    <div class="signature">
      <div>توقيع الأخصائي</div>
      <div>التاريخ</div>
    </div>
  </div>

</div>
</body>
</html>`;
}

