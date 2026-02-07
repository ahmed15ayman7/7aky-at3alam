import { PlanData } from "@/types/plan";

export function generatePlanHtml(
  planData: PlanData,
  childName: string,
  therapistName: string
): string {
  // حساب فهرسة الأهداف حسب المدة
  const goalsTimeline = planData.stages.map((stage, idx) => ({
    stageNumber: idx + 1,
    title: stage.title,
    period: stage.period,
    duration: stage.duration || "غير محدد",
    goal: stage.goal || stage.description || "تحسين المهارات",
  }));

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${planData.title}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: "Cairo", "Tahoma", "Arial", sans-serif;
      background: #fff;
      color: #333;
      margin: 0;
      padding: 20px;
      line-height: 1.8;
      font-size: 14px;
    }

    .container {
      max-width: 1000px;
      margin: auto;
      border: 3px solid #cebc09;
      border-radius: 16px;
      padding: 40px;
      background: #ffffff;
    }

    .header {
      text-align: center;
      border-bottom: 4px solid #cebc09;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }

    .header h1 {
      color: #cebc09;
      margin: 0 0 12px 0;
      font-size: 32px;
      font-weight: bold;
    }

    .header p {
      color: #0c53b1;
      font-size: 18px;
      margin: 8px 0;
    }

    .section {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }

    .section-title {
      background: linear-gradient(135deg, #cebc09 0%, #f5e44d 100%);
      color: #333;
      padding: 14px 20px;
      border-radius: 10px;
      font-weight: bold;
      margin-bottom: 20px;
      font-size: 20px;
      border-right: 6px solid #0c53b1;
      box-shadow: 0 2px 8px rgba(206, 188, 9, 0.3);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-box {
      background: #fff8e1;
      padding: 14px 18px;
      border-radius: 10px;
      border-right: 5px solid #cebc09;
      font-size: 15px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .info-box strong {
      color: #0c53b1;
      display: block;
      margin-bottom: 4px;
    }

    .timeline {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 12px;
      border: 2px solid #e0e0e0;
      margin-bottom: 24px;
    }

    .timeline-item {
      padding: 16px;
      margin-bottom: 16px;
      background: white;
      border-radius: 10px;
      border-right: 6px solid #cebc09;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .timeline-title {
      font-size: 18px;
      font-weight: bold;
      color: #0c53b1;
    }

    .timeline-duration {
      background: #cebc09;
      color: #333;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
    }

    .timeline-goal {
      color: #555;
      font-size: 15px;
      margin-top: 8px;
      padding-right: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      overflow: hidden;
    }

    table th {
      background: linear-gradient(135deg, #0c53b1 0%, #1565c0 100%);
      color: white;
      padding: 14px 12px;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
    }

    table td {
      border: 1px solid #e0e0e0;
      padding: 12px 10px;
      background: #fff;
      vertical-align: top;
      font-size: 13px;
      line-height: 1.6;
    }

    table tr:nth-child(even) td {
      background: #fafafa;
    }

    table tr:hover td {
      background: #fff8e1;
    }

    /* تنسيق الأعمدة */
    table td:nth-child(1) { /* كود */
      width: 50px;
      text-align: center;
      font-weight: bold;
      color: #0c53b1;
      background: #f0f4ff !important;
    }

    table td:nth-child(2) { /* اسم النشاط */
      width: 140px;
      font-weight: 600;
      color: #333;
    }

    table td:nth-child(3) { /* الهدف */
      width: 160px;
    }

    table td:nth-child(4) { /* الأنشطة */
      width: 180px;
    }

    table td:nth-child(5) { /* أمثلة */
      width: 140px;
      font-size: 12px;
    }

    table td:nth-child(6) { /* محكات */
      width: 110px;
      font-size: 12px;
      white-space: pre-line;
    }

    table td:nth-child(7) { /* الدرجة */
      width: 50px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      color: #cebc09;
    }

    .stage-header {
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      padding: 20px;
      border-radius: 12px;
      margin: 24px 0 16px 0;
      border-right: 8px solid #0c53b1;
    }

    .stage-title {
      font-size: 22px;
      font-weight: bold;
      color: #0c53b1;
      margin-bottom: 8px;
    }

    .stage-meta {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .stage-meta-item {
      background: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
    }

    .stage-meta-item strong {
      color: #0c53b1;
      margin-left: 6px;
    }

    .activities-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .activities-list li {
      padding: 6px 0 6px 20px;
      position: relative;
    }

    .activities-list li:before {
      content: "▪";
      position: absolute;
      right: 0;
      color: #cebc09;
      font-size: 18px;
    }

    .session-model {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }

    .session-item {
      background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
      padding: 18px;
      border-radius: 12px;
      border: 2px solid #cebc09;
      text-align: center;
    }

    .session-duration {
      font-size: 28px;
      font-weight: bold;
      color: #0c53b1;
      margin-bottom: 8px;
    }

    .session-activity {
      font-size: 15px;
      color: #555;
    }

    .evaluation-list {
      list-style: none;
      padding: 0;
    }

    .evaluation-list li {
      padding: 12px 20px;
      margin: 10px 0;
      background: #fff8e1;
      border-radius: 10px;
      border-right: 5px solid #0c53b1;
      font-size: 15px;
      position: relative;
      padding-right: 40px;
    }

    .evaluation-list li:before {
      content: "✓";
      position: absolute;
      right: 12px;
      color: #cebc09;
      font-size: 22px;
      font-weight: bold;
    }

    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 3px dashed #cebc09;
      font-size: 14px;
      color: #666;
    }

    .signature {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
      margin-top: 48px;
    }

    .signature-box {
      text-align: center;
      padding-top: 16px;
      border-top: 2px solid #999;
    }

    hr {
      border: none;
      border-top: 3px solid #cebc09;
      margin: 40px 0;
    }

    @media print {
      body {
        padding: 0;
      }
      
      .container {
        border: none;
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      table {
        page-break-inside: auto;
      }
      
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  </style>
</head>

<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <h1>${planData.title}</h1>
    <p>برنامج علاجي فردي متخصص</p>
  </div>

  <!-- BASIC INFO -->
  <div class="section">
    <div class="section-title">📋 البيانات الأساسية</div>
    <div class="info-grid">
      <div class="info-box">
        <strong>اسم الطفل</strong>
        ${childName}
      </div>
      <div class="info-box">
        <strong>اسم الأخصائي</strong>
        ${therapistName}
      </div>
      <div class="info-box">
        <strong>مدة البرنامج</strong>
        ${planData.duration}
      </div>
      <div class="info-box">
        <strong>تاريخ التقييم</strong>
        ${new Date().toLocaleDateString("ar-EG")}
      </div>
    </div>
  </div>

  <!-- GENERAL GOAL -->
  <div class="section">
    <div class="section-title">🎯 الهدف العلاجي العام</div>
    <div class="info-box" style="font-size: 16px; padding: 18px;">
      ${planData.generalGoal}
    </div>
  </div>

  <!-- GOALS TIMELINE -->
  <div class="section">
    <div class="section-title">📅 فهرسة الأهداف حسب المدة الزمنية</div>
    <div class="timeline">
      ${goalsTimeline
        .map(
          (item) => `
        <div class="timeline-item">
          <div class="timeline-header">
            <div class="timeline-title">المرحلة ${item.stageNumber}: ${item.title}</div>
            <div class="timeline-duration">${item.duration}</div>
          </div>
          <div style="color: #777; font-size: 13px; margin-bottom: 6px;">⏱ ${item.period}</div>
          <div class="timeline-goal"><strong>الهدف:</strong> ${item.goal}</div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>

  <!-- DETAILED STAGES -->
  ${planData.stages
    .map(
      (stage) => `
    <div class="section">
      <hr />
      <div class="stage-header">
        <div class="stage-title">المرحلة ${stage.stageNumber}: ${stage.title}</div>
        <div class="stage-meta">
          <div class="stage-meta-item">
            <strong>⏱ الفترة:</strong> ${stage.period}
          </div>
          <div class="stage-meta-item">
            <strong>📆 المدة:</strong> ${stage.duration || "غير محدد"}
          </div>
          <div class="stage-meta-item">
            <strong>📌 عدد الأنشطة:</strong> ${stage.tasks.length} نشاط
          </div>
        </div>
        ${
          stage.goal
            ? `<div style="margin-top: 12px; padding: 12px; background: white; border-radius: 8px;">
                 <strong style="color: #0c53b1;">🎯 الهدف:</strong> ${stage.goal}
               </div>`
            : ""
        }
        ${
          stage.description
            ? `<div style="margin-top: 8px; padding: 12px; background: white; border-radius: 8px; font-size: 14px; color: #666;">
                 ${stage.description}
               </div>`
            : ""
        }
      </div>
      
      <table>
        <thead>
          <tr>
            <th>كود</th>
            <th>اسم النشاط</th>
            <th>الهدف</th>
            <th>الأنشطة المقترحة</th>
            <th>أمثلة</th>
            <th>محكات الأداء</th>
            <th>الدرجة</th>
          </tr>
        </thead>
        <tbody>
          ${stage.tasks
            .map((task) => {
              let activitiesHtml = "-";
              if (task.activities) {
                try {
                  const activities =
                    typeof task.activities === "string"
                      ? JSON.parse(task.activities)
                      : task.activities;
                  if (Array.isArray(activities) && activities.length > 0) {
                    activitiesHtml = `<ul class="activities-list">${activities.map((act) => `<li>${act}</li>`).join("")}</ul>`;
                  }
                } catch (e) {
                  activitiesHtml = typeof task.activities === "string" ? task.activities : "";
                }
              }

              return `
            <tr>
              <td>${task.taskCode}</td>
              <td>${task.taskName}</td>
              <td>${task.goal}</td>
              <td>${activitiesHtml}</td>
              <td>${task.examples}</td>
              <td>${task.performanceCriteria}</td>
              <td>${task.score}</td>
            </tr>
          `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `
    )
    .join("")}

  <!-- SESSION MODEL -->
  <div class="section">
    <hr />
    <div class="section-title">⏰ نموذج الجلسة العلاجية</div>
    <div class="session-model">
      <div class="session-item">
        <div class="session-duration">${planData.sessionModel.freePlay} دقائق</div>
        <div class="session-activity">لعب حر موجه</div>
      </div>
      <div class="session-item">
        <div class="session-duration">${planData.sessionModel.coreSkill} دقيقة</div>
        <div class="session-activity">تدريب مهارة أساسية</div>
      </div>
      <div class="session-item">
        <div class="session-duration">${planData.sessionModel.interactive} دقائق</div>
        <div class="session-activity">نشاط تفاعلي</div>
      </div>
      <div class="session-item">
        <div class="session-duration">${planData.sessionModel.reinforcement} دقائق</div>
        <div class="session-activity">تعزيز وإنهاء</div>
      </div>
    </div>
  </div>

  <!-- EVALUATION CRITERIA -->
  <div class="section">
    <div class="section-title">📊 محكات التقييم والمتابعة</div>
    <ul class="evaluation-list">
      ${planData.evaluationCriteria.map((criterion) => `<li>${criterion}</li>`).join("")}
    </ul>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p style="text-align: center; font-size: 15px; color: #666; line-height: 1.8;">
      ⚠️ هذا البرنامج العلاجي إرشادي وقابل للتعديل وفق استجابة الطفل وتقدير الأخصائي المعالج.
      <br>
      يُنصح بالمتابعة الدورية وتقييم التقدم كل أسبوعين.
    </p>

    <div class="signature">
      <div class="signature-box">
        <strong>توقيع الأخصائي</strong>
        <div style="margin-top: 8px; color: #999;">___________________</div>
      </div>
      <div class="signature-box">
        <strong>التاريخ</strong>
        <div style="margin-top: 8px; color: #999;">___________________</div>
      </div>
    </div>
  </div>

</div>
</body>
</html>`;
}
