import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import WorkoutBuilder from "../workout-builder/page";

describe("WorkoutBuilder Component", () => {
  beforeEach(() => {
    render(<WorkoutBuilder />);
  });

  it("renders correctly", () => {
    expect(screen.getByText("Create Workout")).toBeInTheDocument();
  });

  it("allows selecting and deselecting workout days", () => {
    const mondayButton = screen.getByText("Monday");

    fireEvent.click(mondayButton);
    expect(mondayButton).toHaveClass("bg-blue-500");

    fireEvent.click(mondayButton);
    expect(mondayButton).not.toHaveClass("bg-blue-500");
  });

  it("adds an exercise to a selected day", async () => {
    const day = "Monday";

    fireEvent.click(screen.getByText(day));

    const exerciseName = await screen.findByText(/Rickshaw Carry/i);
    expect(exerciseName).toBeInTheDocument();

    const addButtons = await screen.findAllByText(/Add to/i);
    fireEvent.click(addButtons[0]);

    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("prevents duplicate exercises on the same day", async () => {
    const day = "Monday";

    fireEvent.click(screen.getByText(day));

    const exerciseName = await screen.findByText(/Rickshaw Carry/i);
    expect(exerciseName).toBeInTheDocument();

    const addButtons = await screen.findAllByText(/Add to/i);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);

    const exerciseItems = screen.getAllByText(/Rickshaw Carry/i);
    expect(exerciseItems.length).toBe(2);
  });

  it("removes an exercise from a day", async () => {
    const day = "Monday";

    fireEvent.click(screen.getByText(day));

    const exerciseName = await screen.findByText(/Rickshaw Carry/i);
    expect(exerciseName).toBeInTheDocument();

    const addButtons = await screen.findAllByText(/Add to/i);
    fireEvent.click(addButtons[0]);

    expect(screen.getByText("Remove")).toBeInTheDocument();

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
  });
});
