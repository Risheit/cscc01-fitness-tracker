import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgressPage from "../page";

// Mock useRouter from next/navigation (App Router)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("ProgressPage Component", () => {
  it("renders without crashing", () => {
    render(<ProgressPage />);
    expect(screen.getByText("Weight Progression")).toBeInTheDocument();
  });

  it("renders the exercise dropdown", () => {
    render(<ProgressPage />);
    expect(screen.getByLabelText("Select an Exercise:")).toBeInTheDocument();
  });
});
