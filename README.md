# 🏥 برنامج علاجي فردي
## منصة إدارة العلاج الطبي لمراكز علاج النطق

---

## 📋 نظرة عامة

منصة شاملة لإدارة العلاج الطبي في مراكز علاج النطق، مع دعم كامل للذكاء الاصطناعي لتوليد الخطط العلاجية وتتبع تقدم الأطفال.

### ✨ المميزات الرئيسية

- 🧒 إدارة شاملة لبيانات الأطفال والمرضى
- 📝 استمارة تقييم طبي متعددة الخطوات
- 🤖 تشخيص ذكي باستخدام ChatGPT API
- 📋 توليد 4 خطط علاجية تلقائياً بالذكاء الاصطناعي
- ✏️ محرر خطط متقدم مع Drag & Drop
- 📊 تتبع الجلسات والتقييمات
- 📈 لوحة تحكم وتحليلات متقدمة
- 📄 تصدير الخطط إلى PDF/Word
- 🔍 بحث عام وشامل
- 📚 مكتبة الخطط العلاجية
- 🌙 دعم RTL والعربية بالكامل

---

## 🚀 التقنيات المستخدمة

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (RTL, Light Mode)
- **shadcn/ui** - مكونات UI حديثة
- **Framer Motion** - الحركات والانتقالات
- **Recharts** - الرسوم البيانية

### Backend & Database
- **Prisma ORM** - إدارة قاعدة البيانات
- **Supabase** - PostgreSQL + Storage
- **Next.js API Routes** - RESTful API

### AI & Integration
- **OpenAI API** (ChatGPT) - التشخيص وتوليد الخطط
- **Puppeteer** - تصدير PDF
- **docx** - تصدير Word

### Testing & Quality
- **Storybook** - UI Components Documentation
- **Vitest** - Unit Testing
- **React Testing Library** - Component Testing
- **ESLint** - Code Quality

---

## 📁 هيكل المشروع

```
7aky-at3alam/
├── prisma/
│   ├── schema.prisma          # نموذج قاعدة البيانات
│   └── seed.ts                # بيانات أولية
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # صفحات Dashboard
│   │   │   ├── page.tsx       # الصفحة الرئيسية
│   │   │   ├── children/      # إدارة الأطفال
│   │   │   ├── centers/       # إدارة المراكز
│   │   │   ├── analytics/     # التحليلات
│   │   │   └── plans/         # مكتبة الخطط
│   │   └── api/               # API Routes
│   │       ├── children/
│   │       ├── assessment/
│   │       ├── diagnosis/
│   │       ├── plans/
│   │       ├── sessions/
│   │       └── centers/
│   ├── components/
│   │   ├── ui/                # shadcn/ui Components
│   │   ├── forms/             # نماذج متعددة الخطوات
│   │   └── plans/             # مكونات الخطط
│   ├── lib/
│   │   ├── prisma.ts          # Prisma Client
│   │   ├── supabase.ts        # Supabase Client
│   │   ├── ai/                # OpenAI Integration
│   │   ├── export/            # PDF/Word Export
│   │   └── utils/             # Utilities
│   └── types/                 # TypeScript Types
├── .storybook/                # Storybook Config
└── package.json
```

---

## 🎯 المراحل المنفذة

### ✅ Phase 1: بيانات الطفل + استمارة التقييم
- نموذج بيانات كامل للطفل (الاسم، العمر، الجنس، المركز)
- استمارة تقييم طبي من 7 خطوات
- حفظ البيانات في Supabase

### ✅ Phase 2: التشخيص بالـ AI
- تحليل بيانات الطفل + الاستمارة
- اقتراح تشخيص تلقائي
- إمكانية تعديل التشخيص من الطبيب
- حفظ التشخيص النهائي

### ✅ Phase 3: توليد 4 خطط علاجية
- توليد 4 خطط مختلفة بالذكاء الاصطناعي
- كل خطة تحتوي على:
  - 3 مراحل علاجية
  - 19 مهمة لكل مرحلة
  - معايير تقييم + أمثلة
- تخزين منظم بـ JSON + HTML

### ✅ Phase 4: محرر الخطط
- تعديل المهام والمراحل
- حذف/نسخ المهام
- Drag & Drop لإعادة الترتيب
- دمج خطط متعددة
- Framer Motion للحركات

### ✅ Phase 5: الجلسات والتقييم
- تسجيل جلسات علاجية
- تقييم أداء كل مهمة
- إضافة ملاحظات
- تتبع التقدم الإجمالي

### ✅ Phase 6: التصدير والتخزين
- تصدير PDF بتنسيق احترافي
- تصدير Word قابل للتعديل
- رفع الملفات إلى Supabase Storage
- ربط الملفات بالخطة

### ✅ Dashboard + التحليلات
- لوحة تحكل رئيسية بالإحصائيات
- بحث عام في الأطفال والخطط
- مكتبة الخطط العلاجية
- رسوم بيانية للتحليلات
- توزيع الخطط حسب التشخيص
- متوسط التقدم حسب المركز

### ✅ Storybook + Tests
- إعداد Storybook للـ UI Components
- Stories للمكونات الأساسية
- Unit Tests مع Vitest
- Component Tests مع React Testing Library

---

## 🛠️ التثبيت والإعداد

### المتطلبات
- Node.js 18+
- npm/yarn
- PostgreSQL (عبر Supabase)
- OpenAI API Key

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd 7aky-at3alam
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

4. **إعداد قاعدة البيانات**
```bash
npx prisma generate
npx prisma db push
npm run seed
```

5. **تشغيل المشروع**
```bash
npm run dev
```

6. **تشغيل Storybook (اختياري)**
```bash
npm run storybook
```

7. **تشغيل الاختبارات (اختياري)**
```bash
npm test
```

---

## 📊 قاعدة البيانات

### النماذج الرئيسية

- **MedicalCenter**: المراكز الطبية
- **Child**: الأطفال/المرضى
- **Therapist**: الأخصائيين
- **Assessment**: الاستمارات التقييمية
- **Diagnosis**: التشخيصات
- **TherapyPlan**: الخطط العلاجية
- **Stage**: مراحل الخطة
- **Task**: مهام العلاج
- **Session**: الجلسات
- **SessionTaskEvaluation**: تقييم المهام

---

## 🎨 التصميم والـ UI

- **نمط التصميم**: Light Mode فقط
- **الاتجاه**: RTL (من اليمين لليسار)
- **الخط**: Cairo (Google Fonts)
- **الألوان الرئيسية**:
  - Primary: `#cebc09`
  - Secondary: `#0c53b1`
- **المكونات**: shadcn/ui مع تخصيص كامل
- **الحركات**: Framer Motion

---

## 🔐 الأمان

- استخدام Prisma لمنع SQL Injection
- التحقق من البيانات باستخدام Zod
- Supabase RLS (Row Level Security)
- API Routes محمية

---

## 📝 API Routes

### Children
- `GET /api/children` - جلب الأطفال
- `POST /api/children` - إضافة طفل
- `GET /api/children/[id]` - جلب طفل واحد
- `PATCH /api/children/[id]` - تحديث طفل

### Assessment
- `POST /api/assessment` - إنشاء استمارة
- `PATCH /api/assessment/[id]` - تحديث استمارة

### Diagnosis
- `POST /api/diagnosis/generate` - توليد تشخيص AI
- `PATCH /api/diagnosis/[id]` - تحديث تشخيص

### Plans
- `POST /api/plans/generate` - توليد 4 خطط
- `GET /api/plans` - جلب الخطط
- `GET /api/plans/[id]` - خطة واحدة
- `POST /api/plans/[id]/export` - تصدير PDF/Word

### Sessions
- `POST /api/sessions` - إنشاء جلسة
- `GET /api/sessions?childId=...` - جلب جلسات طفل
- `PATCH /api/sessions/[id]` - تحديث جلسة

---

## 🧪 الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch

# تشغيل تقرير التغطية
npm run test:coverage
```

---

## 📚 Storybook

```bash
# تشغيل Storybook
npm run storybook

# بناء Storybook للإنتاج
npm run build-storybook
```

---

## 🚀 النشر

### Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر
vercel
```

### متغيرات البيئة في Production
تأكد من إضافة جميع المتغيرات في لوحة تحكم Vercel:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

---

## 🤝 المساهمة

هذا مشروع خاص. للاستفسارات، يرجى التواصل مع مالك المشروع.

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2026

---

## 📞 الدعم

للدعم الفني أو الاستفسارات:
- البريد الإلكتروني: support@example.com
- الهاتف: +966 XX XXX XXXX

---

## 🎉 شكر خاص

- **Next.js** - Framework
- **Prisma** - ORM
- **Supabase** - Backend
- **OpenAI** - AI Integration
- **shadcn/ui** - UI Components
- **Framer Motion** - Animations

---

تم التطوير بـ ❤️ في المملكة العربية السعودية
