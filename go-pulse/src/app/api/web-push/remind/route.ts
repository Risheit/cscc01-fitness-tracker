import { NextResponse } from 'next/server';
import checkAuth from '../../check-auth/CheckAuth';
import { sendNotification, subscriptions } from '@/app/models/Push';
import { getUserWorkouts } from '@/app/models/Workout';

export async function POST(req: Request) {
  const authData = await checkAuth(req);
  if (!authData.authenticated || authData.userId !== 1) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    console.log('sending reminders')
    sendWorkoutReminders();
    return NextResponse.json({ message: 'reminders sent' }, { status: 200 });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'error sending reminders' }, { status: 500 });
  }
}

async function sendWorkoutReminders() {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = new Date();
  const dayName = daysOfWeek[today.getDay()];

  for (const userId_ in subscriptions) {
    const userId = +userId_;
    const subscription = subscriptions[userId];
    if (!subscription) continue;

    const workouts = await getUserWorkouts(userId);

    workouts.forEach((workout) => {
      console.log('sending message for workout ', workout);
      console.log('user', userId);
      if (workout.day.toLowerCase() === dayName.toLowerCase()) {
        sendNotification(userId, {
          title: "Don't forget your workout today!",
          body: `You have your ${workout.name} to do.`,
          url: `${process.env.NEXT_PUBLIC_URL}/workout?id=${workout.id}`,
        });
      }
    });
  }
}