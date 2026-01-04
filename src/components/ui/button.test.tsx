import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { Button } from "./button";

describe("Button Component", () => {
  test("renders button with text", () => {
    render(<Button>حفظ</Button>);
    expect(screen.getByText("حفظ")).toBeInTheDocument();
  });

  test("renders disabled button", () => {
    render(<Button disabled>حفظ</Button>);
    const button = screen.getByText("حفظ");
    expect(button).toBeDisabled();
  });

  test("applies variant classes", () => {
    const { rerender } = render(<Button variant="outline">تعديل</Button>);
    expect(screen.getByText("تعديل")).toHaveClass("border-input");

    rerender(<Button variant="secondary">إلغاء</Button>);
    expect(screen.getByText("إلغاء")).toHaveClass("bg-secondary");
  });

  test("applies size classes", () => {
    const { rerender } = render(<Button size="sm">صغير</Button>);
    expect(screen.getByText("صغير")).toHaveClass("h-9");

    rerender(<Button size="lg">كبير</Button>);
    expect(screen.getByText("كبير")).toHaveClass("h-11");
  });
});

