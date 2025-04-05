import { NextRequest, NextResponse } from 'next/server';
import pool from '../../db/database';
import checkAuth from '../check-auth/CheckAuth';
import { User } from '@/app/models/User';

export async function GET(req: NextRequest) {
  const authData = await checkAuth(req);
  if (!authData.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        full_name as "fullName", 
        weight_lbs as weight, 
        age, 
        gender, 
        bio
       FROM users
       WHERE id = $1;`,
      [authData.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    console.log('Profile data fetched successfully:', rows[0]);
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const authData = await checkAuth(req);
  if (!authData.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { fullName, age, weight, gender, bio }: User = await req.json();

    await pool.query(
      `UPDATE users SET
        full_name = $2,
        age = $3,
        weight_lbs = $4,
        gender = $5,
        bio = $6
      WHERE id = $1;`,
      [
        authData.userId!,
        fullName ?? null,
        age ?? null,
        weight ?? null,
        gender ?? null,
        bio ?? null,
      ]
    );
    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
