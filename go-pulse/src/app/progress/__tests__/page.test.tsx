import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgressPage from "../page";

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
