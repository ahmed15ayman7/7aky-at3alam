import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, phone, email, licenseNumber, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "اسم المركز مطلوب" },
        { status: 400 }
      );
    }

    const center = await prisma.center.create({
      data: {
        name,
        address,
        phone,
        email,
        licenseNumber,
        description,
      },
    });

    return NextResponse.json(center, { status: 201 });
  } catch (error) {
    console.error("Error creating center:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء المركز" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const centers = await prisma.center.findMany({
      include: {
        _count: {
          select: {
            children: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(centers);
  } catch (error) {
    console.error("Error fetching centers:", error);
    return NextResponse.json(
      { error: "فشل في جلب المراكز" },
      { status: 500 }
    );
  }
}

