import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../components/NavBar';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

test('Logout button calls API and redirects', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: async () => ({}) } as Response)
  ) as typeof fetch;
  
  render(<NavBar tabNames={['test']} />);
  const logoutButton = screen.getByTitle('logout');

  await fireEvent.click(logoutButton);

  expect(global.fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' });

  expect(mockPush).toHaveBeenCalledWith('/login');
});
