import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="p-6 w-80">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        بطاقة افتراضية
      </h3>
      <p className="text-gray-600">
        هذه بطاقة افتراضية تحتوي على محتوى عادي
      </p>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="p-6 w-80">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">أحمد محمد</h3>
          <p className="text-sm text-gray-600">5 سنوات</p>
        </div>
        <Badge className="bg-primary">نشط</Badge>
      </div>
      <p className="text-gray-600">
        طفل مسجل في المركز الطبي
      </p>
    </Card>
  ),
};

export const ChildCard: Story = {
  render: () => (
    <Card className="p-6 w-80 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">سارة أحمد</h3>
          <p className="text-sm text-gray-600 mt-1">
            العمر: 4 سنوات | التشخيص: اضطراب طيف التوحد
          </p>
        </div>
        <Badge className="bg-green-500">جلسة نشطة</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">عدد الجلسات:</span>
          <span className="font-semibold">12</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">متوسط التقدم:</span>
          <span className="font-semibold text-green-600">75%</span>
        </div>
      </div>
    </Card>
  ),
};

export const PlanCard: Story = {
  render: () => (
    <Card className="p-6 w-96">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            خطة علاجية - المرحلة الأولى
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            الطفل: أحمد محمد
          </p>
        </div>
        <Badge variant="outline">اضطراب طيف التوحد</Badge>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        خطة علاجية تركز على تطوير مهارات التواصل والانتباه المشترك
      </p>
      <div className="flex gap-2">
        <Badge className="bg-secondary text-sm">3 مراحل</Badge>
        <Badge className="bg-primary text-sm">57 مهمة</Badge>
      </div>
    </Card>
  ),
};

