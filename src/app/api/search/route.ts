import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ children: [], plans: [] });
    }

    // Search children
    const children = await prisma.child.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { center: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        center: true,
        therapist: true,
      },
      take: 5,
    });

    // Search therapy plans
    const plans = await prisma.therapyPlan.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { child: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        child: true,
        diagnosis: true,
      },
      take: 5,
    });

    return NextResponse.json({
      children,
      plans,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "فشل في البحث" },
      { status: 500 }
    );
  }
}

