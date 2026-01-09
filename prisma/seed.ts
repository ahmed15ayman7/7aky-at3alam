import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء seed البيانات التجريبية...");

  // Create Center
  const center = await prisma.center.upsert({
    where: { id: "demo-center-id" },
    update: {},
    create: {
      id: "demo-center-id",
      name: "مركز حقي أتعلم للتخاطب",
      address: "القاهرة، مصر",
      phone: "01234567890",
      email: "info@7aky-at3alam.com",
    },
  });

  console.log("✅ تم إنشاء المركز:", center.name);

  // Create Therapist
  const therapist = await prisma.therapist.upsert({
    where: { email: "ahmed@7aky-at3alam.com" },
    update: {},
    create: {
      name: "د. أحمد محمد",
      email: "ahmed@7aky-at3alam.com",
      phone: "01234567890",
      centerId: center.id,
    },
  });

  console.log("✅ تم إنشاء الأخصائي:", therapist.name);

  // Create Demo Child
  const child = await prisma.child.create({
    data: {
      name: "يوسف أحمد",
      dateOfBirth: new Date("2020-03-15"),
      age: 4,
      gender: "male",
      address: "القاهرة",
      fatherJob: "مهندس",
      motherJob: "معلمة",
      phone: "01234567890",
      hasRelativeIssue: false,
      centerId: center.id,
      therapistId: therapist.id,
    },
  });

  console.log("✅ تم إنشاء طفل تجريبي:", child.name);

  console.log(`
  
  🎉 تم إنشاء البيانات التجريبية بنجاح!
  
  📋 المعلومات:
  - ID المركز: ${center.id}
  - ID الأخصائي: ${therapist.id}
  - ID الطفل: ${child.id}
  
  💡 الخطوات التالية:
  1. قم بتحديث temporary IDs في: src/app/(dashboard)/children/new/page.tsx
  2. استخدم المعرفات أعلاه بدلاً من "temp-center-id" و "temp-therapist-id"
  3. قم بتشغيل المشروع: npm run dev
  4. ابدأ بملء استمارة التقييم للطفل التجريبي
  
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ خطأ في seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

