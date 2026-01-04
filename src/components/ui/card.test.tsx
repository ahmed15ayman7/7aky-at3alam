import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { Card } from "./card";

describe("Card Component", () => {
  test("renders card with children", () => {
    render(
      <Card>
        <p>محتوى البطاقة</p>
      </Card>
    );
    expect(screen.getByText("محتوى البطاقة")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Card className="p-6">محتوى</Card>);
    const card = screen.getByText("محتوى").parentElement;
    expect(card).toHaveClass("p-6");
  });

  test("renders complex card structure", () => {
    render(
      <Card className="p-6">
        <h3>العنوان</h3>
        <p>الوصف</p>
        <button>زر</button>
      </Card>
    );
    
    expect(screen.getByText("العنوان")).toBeInTheDocument();
    expect(screen.getByText("الوصف")).toBeInTheDocument();
    expect(screen.getByText("زر")).toBeInTheDocument();
  });
});

