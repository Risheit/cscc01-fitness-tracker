export interface AuthResponse {
  authenticated: boolean;
  userId?: number;
}

// Function to check authentication status and get userId by calling check-auth route
export default async function checkAuth(req: Request) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/check-auth`, {
    headers: req.headers, // Pass the headers (including cookie)
  });
  return response.json() as Promise<AuthResponse>;
}