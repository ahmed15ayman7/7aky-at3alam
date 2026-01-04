import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "حفظ التعديلات",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "إلغاء",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "عرض التفاصيل",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "إضافة طفل جديد",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "تعديل",
  },
};

export const Disabled: Story = {
  args: {
    children: "جاري الحفظ...",
    disabled: true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <svg
        className="w-5 h-5 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      إضافة جديد
    </Button>
  ),
};

