import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";

interface Task {
  taskCode: string;
  taskName: string;
  goal: string;
  question: string;
  examples: string;
  performanceCriteria: string;
  score: number;
  notes?: string;
}

interface Stage {
  title: string;
  period: string;
  tasks: Task[];
}

interface PlanData {
  childName: string;
  therapistName: string;
  centerName: string;
  diagnosis: string;
  generalGoal: string;
  stages: Stage[];
}

export function generateWordDocument(planData: PlanData): Document {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "برنامج علاجي فردي",
            heading: "Heading1",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Child Info
          new Paragraph({
            children: [
              new TextRun({ text: "اسم الطفل: ", bold: true }),
              new TextRun(planData.childName),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "اسم الأخصائي: ", bold: true }),
              new TextRun(planData.therapistName),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "المركز: ", bold: true }),
              new TextRun(planData.centerName),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "التشخيص: ", bold: true }),
              new TextRun(planData.diagnosis),
            ],
            spacing: { after: 200 },
          }),

          // General Goal
          new Paragraph({
            text: "الهدف العام:",
            heading: "Heading2",
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: planData.generalGoal,
            spacing: { after: 200 },
          }),

          // Stages
          ...planData.stages.flatMap((stage, stageIdx) => [
            new Paragraph({
              text: `المرحلة ${stageIdx + 1}: ${stage.title}`,
              heading: "Heading2",
              spacing: { before: 400, after: 100 },
            }),

            new Paragraph({
              text: `المدة: ${stage.period}`,
              spacing: { after: 200 },
            }),

            createTaskTable(stage.tasks),
          ]),
        ],
      },
    ],
  });

  return doc;
}

function createTaskTable(tasks: Task[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        children: [new Paragraph({ text: "كود المهمة", alignment: AlignmentType.CENTER })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "اسم المهمة", alignment: AlignmentType.CENTER })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "الهدف", alignment: AlignmentType.CENTER })],
        width: { size: 25, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "السؤال", alignment: AlignmentType.CENTER })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "أمثلة", alignment: AlignmentType.CENTER })],
        width: { size: 15, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ text: "الدرجة", alignment: AlignmentType.CENTER })],
        width: { size: 10, type: WidthType.PERCENTAGE },
      }),
    ],
  });

  const taskRows = tasks.map(
    (task) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(task.taskCode)],
          }),
          new TableCell({
            children: [new Paragraph(task.taskName)],
          }),
          new TableCell({
            children: [new Paragraph(task.goal)],
          }),
          new TableCell({
            children: [new Paragraph(task.question)],
          }),
          new TableCell({
            children: [new Paragraph(task.examples)],
          }),
          new TableCell({
            children: [new Paragraph(task.score.toString())],
          }),
        ],
      })
  );

  return new Table({
    rows: [headerRow, ...taskRows],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
}

