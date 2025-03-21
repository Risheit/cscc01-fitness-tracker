import { cookies } from 'next/headers';
import { AdminDashboard } from './components/AdminDashboard';

export default async function AdminPage() {
  const isAdmin = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/check-auth/admin`,
    {
      headers: { Cookie: (await cookies()).toString() },
      credentials: 'include',
    }
  );

  // Admins log into dash boards.
  if (!isAdmin.ok) {
    return <p>Not Authorized.</p>;
  }

  return <AdminDashboard />;
}
