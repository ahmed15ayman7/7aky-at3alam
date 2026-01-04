import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { childFormSchema } from "@/lib/utils/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const centerId = searchParams.get("centerId");
    const therapistId = searchParams.get("therapistId");

    const where: any = {};
    if (centerId) where.centerId = centerId;
    if (therapistId) where.therapistId = therapistId;

    const children = await prisma.child.findMany({
      where,
      include: {
        center: true,
        therapist: true,
        diagnoses: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        therapyPlans: {
          where: { isActive: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات الأطفال" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = childFormSchema.parse(body);

    // Calculate age from dateOfBirth
    const age = Math.floor(
      (new Date().getTime() - validatedData.dateOfBirth.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

    const child = await prisma.child.create({
      data: {
        ...validatedData,
        age,
      },
      include: {
        center: true,
        therapist: true,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error: any) {
    console.error("Error creating child:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل في إضافة الطفل" },
      { status: 500 }
    );
  }
}

