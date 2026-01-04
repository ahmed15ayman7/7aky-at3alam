import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "destructive"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "نشط",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "اضطراب طيف التوحد",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "قيد الانتظار",
  },
};

export const Primary: Story = {
  render: () => <Badge className="bg-primary">خطة نشطة</Badge>,
};

export const Success: Story = {
  render: () => <Badge className="bg-green-500">مكتمل</Badge>,
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-primary">3 مراحل</Badge>
      <Badge className="bg-secondary">57 مهمة</Badge>
      <Badge className="bg-green-500">12 جلسة</Badge>
    </div>
  ),
};

