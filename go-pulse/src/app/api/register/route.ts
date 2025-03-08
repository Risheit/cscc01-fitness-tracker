import { NextResponse } from 'next/server';
import pool from '../../db/database';  // Update with correct import path
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Validate the input
  if (!username || !password) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  // Check if the user already exists
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (result.rows.length > 0) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, hashedPassword]
  );

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}
