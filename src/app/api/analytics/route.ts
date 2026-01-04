import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Plans by diagnosis
    const diagnosesWithPlans = await prisma.diagnosis.groupBy({
      by: ["finalDiagnosis"],
      _count: {
        finalDiagnosis: true,
      },
    });

    const plansByDiagnosis = diagnosesWithPlans.map((d) => ({
      diagnosis: d.finalDiagnosis || "غير محدد",
      count: d._count.finalDiagnosis,
    }));

    // Sessions by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sessions = await prisma.session.findMany({
      where: {
        sessionDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        sessionDate: true,
      },
    });

    const sessionsByMonth = sessions.reduce((acc: any, session) => {
      const month = new Date(session.sessionDate).toLocaleDateString("ar-EG", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const sessionsByMonthArray = Object.entries(sessionsByMonth).map(
      ([month, count]) => ({
        month,
        count,
      })
    );

    // Progress by center
    const centers = await prisma.center.findMany({
      include: {
        children: {
          include: {
            sessions: {
              where: {
                overallProgress: {
                  not: null,
                },
              },
            },
          },
        },
      },
    });

    const progressByCenter = centers.map((center) => {
      const allSessions = center.children.flatMap((child) => child.sessions);
      const avgProgress =
        allSessions.length > 0
          ? allSessions.reduce(
              (sum, session) => sum + (session.overallProgress || 0),
              0
            ) / allSessions.length
          : 0;

      return {
        center: center.name,
        avgProgress: Math.round(avgProgress),
      };
    });

    // Top performing plans
    const plans = await prisma.therapyPlan.findMany({
      include: {
        stages: {
          include: {
            tasks: true,
          },
        },
      },
    });

    const topPerformingPlans = plans
      .map((plan) => {
        const allTasks = plan.stages.flatMap((stage) => stage.tasks);
        const avgScore =
          allTasks.length > 0
            ? allTasks.reduce((sum, task) => sum + task.score, 0) /
              allTasks.length
            : 0;

        return {
          planTitle: plan.title || "خطة علاجية",
          avgScore,
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    return NextResponse.json({
      plansByDiagnosis,
      sessionsByMonth: sessionsByMonthArray,
      progressByCenter,
      topPerformingPlans,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "فشل في جلب التحليلات" },
      { status: 500 }
    );
  }
}

