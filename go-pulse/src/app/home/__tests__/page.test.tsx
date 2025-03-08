import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

const mockPush = vi.fn();

async function searchParams() { return { tab: 'workouts'}}

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('fetch')

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

test('Workout page displays correctly', async () => {

})

test('Logout button calls API and redirects', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: async () => ({}) } as Response)
  ) as typeof fetch;
  render(<Home searchParams={searchParams()} />);
  const logoutButton = screen.getByTitle('logout');

  await fireEvent.click(logoutButton);

  expect(global.fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' });

  expect(mockPush).toHaveBeenCalledWith('/login');
});
