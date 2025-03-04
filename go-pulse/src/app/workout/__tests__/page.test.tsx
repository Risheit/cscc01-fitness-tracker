import { expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ExerciseData } from '@/app/models/Workout';
import ExerciseScreen from '../../[id]/components/ExerciseScreen';

const mockWorkoutData: ExerciseData[] = [
  {
    name: 'Bench Press',
    description: 'Bench Press Description',
    videoId: 'gMgvBspQ9lk',
    imagePath: '/weight.jpg',
    type: 'Sets',
    sets: 2,
    reps: 3,
  },
  {
    name: 'Squats',
    description: 'Squats Description',
    videoId: 'gMgvBspQ9lk',
    imagePath: '/weight.jpg',
    type: 'Timed',
    mins: 15,
  },
];

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));

function clickButton(name: string) {
  const button = screen.getByRole('button', { name });
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
}

function checkCurrentRep(amt: number) {
  expect(screen.getByText(`Reps: ${amt}`)).toBeInTheDocument();
}

function checkCurrentSet(amt: number) {
  expect(screen.getByText(`Sets: ${amt}`)).toBeInTheDocument();
}

test('run Workout page flow', async () => {
  vi.useFakeTimers();

  render(<ExerciseScreen exercises={mockWorkoutData} />);

  // Check the starting screen
  expect(
    screen.getByRole('heading', { level: 1, name: 'Beginning with...' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 1, name: mockWorkoutData[0].name })
  ).toBeInTheDocument();
  expect(screen.getByText(mockWorkoutData[0].description)).toBeInTheDocument();

  // Move to Sets workout screen
  clickButton('Continue');

  // Click through Sets workout screen
  checkCurrentRep(1);
  checkCurrentSet(1);
  clickButton('Next Rep');
  checkCurrentRep(2);
  checkCurrentSet(1);
  clickButton('Next Rep');
  checkCurrentRep(3);
  checkCurrentSet(1);
  clickButton('Next Rep');
  checkCurrentRep(1);
  checkCurrentSet(2);
  clickButton('Next Rep');
  checkCurrentRep(2);
  checkCurrentSet(2);
  clickButton('Next Rep');
  checkCurrentRep(3);
  checkCurrentSet(2);
  clickButton('Next Rep');

  // Move to timer workout screen
  expect(
    screen.getByRole('heading', { level: 1, name: 'Coming up...' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 1, name: mockWorkoutData[1].name })
  ).toBeInTheDocument();
  expect(screen.getByText(mockWorkoutData[1].description)).toBeInTheDocument();
  clickButton('Continue');

  // Check if timer running
  expect(screen.getByText(`${mockWorkoutData[1].mins!}m 0s`));
  act(() => {
    vi.advanceTimersByTime(1000); // Decrease timer by a second
  });

  expect(screen.getByText(`${mockWorkoutData[1].mins! - 1}m 59s`));
  act(() => {
    vi.runAllTimers(); // End timer
  });
  expect(screen.getByRole('button', { name: 'Pause' })).toBeDisabled();
  clickButton('Complete');

  // Check if final page
  screen.getByRole('heading', { level: 1, name: 'Good work!' });
  clickButton('Finish');
});

test('try Timer pausing', async () => {
  vi.useFakeTimers();

  render(<ExerciseScreen exercises={mockWorkoutData} />);

  // Skip to Timer page
  clickButton('Continue');
  clickButton('Skip');
  clickButton('Continue');

  // Try pausing timer
  expect(screen.getByText(`${mockWorkoutData[1].mins!}m 0s`));
  clickButton('Pause');
  expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();

  // Expect no change to timer when paused
  expect(screen.getByText(`${mockWorkoutData[1].mins!}m 0s`));

  // Expect timer to start again after continue
  clickButton('Continue');
  act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(screen.getByText(`${mockWorkoutData[1].mins! - 1}m 55s`));

  act(() => {
    vi.runAllTimers(); // End timer
  });
  expect(screen.getByRole('button', { name: 'Pause' })).toBeDisabled();
  clickButton('Complete');
});
