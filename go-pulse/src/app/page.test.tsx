import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";

// ✅ Move `mockPush` outside the test functions
const mockPush = vi.fn();

// ✅ Mock Next.js modules before tests run
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// ✅ Correctly mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

test("renders Home page correctly", () => {
  render(<Home />);

  // Check the heading
  expect(screen.getByRole("heading", { level: 1, name: "Welcome to the Home Page" })).toBeInTheDocument();

  // Check for the navigation links
  expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Info" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  
  // Check for the Logout button
  expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
});

test("Logout button calls API and redirects", async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true })) as unknown as typeof fetch;

  render(<Home />);
  const logoutButton = screen.getByRole("button", { name: "Logout" });

  await fireEvent.click(logoutButton);

  expect(global.fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });

  // ✅ Now `mockPush` is correctly recognized
  expect(mockPush).toHaveBeenCalledWith("/login");
});
