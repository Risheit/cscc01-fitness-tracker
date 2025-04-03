import { render, screen, fireEvent, act } from '@testing-library/react';
import { expect } from 'vitest';
import WorkoutBuilder from '../components/WorkoutBuilder/WorkoutBuilder';
import { NinjaApiExercise } from '@/app/models/Ninja';

const mockExercises: NinjaApiExercise[] = [
  {
    name: 'Rickshaw Carry',
    muscle: 'forearms',
    type: 'strength',
    equipment: 'nothing',
    difficulty: 'hard',
    instructions: 'Raise your hips',
  },
];

const mockFetchNinjaExercises = vi.fn(() => mockExercises);
const mockAddExerciseToWorkout = vi.fn();
const mockCreateWorkout = vi.fn(() => 1);

vi.mock('@/app/models/Ninja', () => ({
  fetchNinjaExercises: () => {
    return mockFetchNinjaExercises();
  },
  addExerciseToWorkout: () => {
    return mockAddExerciseToWorkout();
  },
  createWorkout: () => {
    return mockCreateWorkout();
  },
}));

test('Builder page renders correctly', async () => {
  await act(async () => {
    render(<WorkoutBuilder />);
  });
  expect(screen.getByText('Create Workout')).toBeInTheDocument();
});

test('Builder allows selecting and deselecting workout days', async () => {
  await act(async () => {
    render(<WorkoutBuilder />);
  });
  expect(screen.queryByText(':00')).not.toBeInTheDocument();

  const mondayButton = screen.getByText('Monday');
  fireEvent.click(mondayButton);

  expect(screen.getByText(':00')).toBeInTheDocument();

  const deleteButton = screen.getByText('✖');
  fireEvent.click(deleteButton);
});

test('Builder allows selecting and deselecting workout days', async () => {
  await act(async () => {
    render(<WorkoutBuilder />);
  });

  const exerciseName = await screen.findByText(/Rickshaw Carry/i);
  expect(exerciseName).toBeInTheDocument();

  const addButtons = await screen.findAllByText(/Add to/i);
  fireEvent.click(addButtons[0]);

  expect(screen.getByText('✖')).toBeInTheDocument();
});

test('Builder removes an exercise from a workout', async () => {
  await act(async () => {
    render(<WorkoutBuilder />);
  });
  const exerciseName = await screen.findByText(/Rickshaw Carry/i);
  expect(exerciseName).toBeInTheDocument();

  const addButtons = await screen.findAllByText(/Add to/i);
  fireEvent.click(addButtons[0]);

  expect(screen.getByText('✖')).toBeInTheDocument();

  const removeButton = screen.getByText('✖');
  fireEvent.click(removeButton);

  expect(screen.queryByText('✖')).not.toBeInTheDocument();
});