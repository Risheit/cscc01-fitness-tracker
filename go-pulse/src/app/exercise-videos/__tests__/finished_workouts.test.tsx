import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutSelectionTab from '../../home/components/WorkoutSelectionTab';
import { WorkoutPlan } from '@/app/models/Workout';

const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: 1,
    name: 'Test_Workout 1',
    imagePath: '/weight.jpg',
  },
  {
    id: 2,
    name: 'Test_Workout 2',
    imagePath: '/weight.jpg',
  },
  {
    id: 3,
    name: 'Test_Workout 3',
    imagePath: '/weight.jpg',
  },
  {
    id: 4,
    name: 'Test_Workout 4',
    imagePath: '/weight.jpg',
  },
  {
    id: 5,
    name: 'Test_Small Test_Workout 5',
    imagePath: '/weight.jpg',
  },
  {
    id: 6,
    name: 'Test_Small Test_Workout 6',
    imagePath: '/weight.jpg',
  },
];

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: () => {
    mockRedirect();
  },
}));

test('Workout page displays correctly', async () => {
  const numWorkouts = mockWorkoutPlans.length;
  const numSmallWorkouts = mockWorkoutPlans.filter((plan) =>
    plan.name.includes('Small')
  ).length;

  render(<WorkoutSelectionTab workouts={mockWorkoutPlans} />);

  expect(screen.getAllByText(/Test_Workout*/)).toHaveLength(numWorkouts);

  fireEvent.change(screen.getByLabelText(/Search*/), {
    target: { value: 'Test_Small ' },
  });
  expect(screen.getAllByText(/Test_Workout*/)).toHaveLength(numSmallWorkouts);

  fireEvent.click(screen.getAllByText(/Test_Workout*/)[0]);
  expect(mockRedirect).toBeCalled();
});
