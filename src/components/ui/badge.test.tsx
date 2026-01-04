import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { Badge } from "./badge";

describe("Badge Component", () => {
  test("renders badge with text", () => {
    render(<Badge>نشط</Badge>);
    expect(screen.getByText("نشط")).toBeInTheDocument();
  });

  test("applies default variant classes", () => {
    render(<Badge>افتراضي</Badge>);
    expect(screen.getByText("افتراضي")).toHaveClass("bg-primary");
  });

  test("applies outline variant classes", () => {
    render(<Badge variant="outline">محدد</Badge>);
    expect(screen.getByText("محدد")).toHaveClass("border");
  });

  test("applies custom className", () => {
    render(<Badge className="bg-green-500">مخصص</Badge>);
    const badge = screen.getByText("مخصص");
    expect(badge).toHaveClass("bg-green-500");
  });
});

