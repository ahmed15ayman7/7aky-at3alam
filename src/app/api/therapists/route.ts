import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const therapists = await prisma.therapist.findMany({
      include: {
        center: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            children: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(therapists);
  } catch (error) {
    console.error("Error fetching therapists:", error);
    return NextResponse.json(
      { error: "فشل في جلب الأخصائيين" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, specialization, licenseNumber, yearsOfExperience, centerId } = body;

    const therapist = await prisma.therapist.create({
      data: {
        name,
        email,
        phone,
        specialization,
        licenseNumber,
        yearsOfExperience: yearsOfExperience || 0,
        centerId,
      },
      include: {
        center: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(therapist, { status: 201 });
  } catch (error: any) {
    console.error("Error creating therapist:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل في إنشاء الأخصائي" },
      { status: 500 }
    );
  }
}

