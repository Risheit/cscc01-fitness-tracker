'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">Go Pulse</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-800 text-center mt-4">
          Do not have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
