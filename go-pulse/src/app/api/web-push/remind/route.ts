import { NextResponse } from 'next/server';
import { checkAuth } from '../../check-auth/route';
import { sendWorkoutReminders } from '@/app/models/Push';

export async function POST(req: Request) {
  const authData = await checkAuth(req);
  if (!authData.authenticated || authData.userId !== 1) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  await sendWorkoutReminders();
  NextResponse.json({ message: 'reminders sent' }, { status: 200 });
}
