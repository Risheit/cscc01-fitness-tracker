// Code taken and modified from https://github.com/ameerezae/web-push-nextjs/

import webpush from 'web-push';
import { getUserWorkouts } from './Workout';

export interface UserSubscription {
  [userId: number]: webpush.PushSubscription;
}

export const subscriptions: UserSubscription = {};

export function notificationUnsupported(): boolean {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  }
  return unsupported;
}

export async function trySubscribeToNotifications(
  state: NotificationPermission
) {
  switch (state) {
    case 'denied':
      return true;
    case 'default':
      return false;
    case 'granted':
      try {
        await navigator.serviceWorker.register('./sw.js');
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
        console.info(
          'Subscribed for push notifications',
          subscription.toJSON()
        );
        const res = await fetch('/api/web-push/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscription }),
        });
        console.log('register completed', await res.json());
        return true;
      } catch (e) {
        console.log('could not subscribe: ', e);
        return false;
      }
  }
}

export interface WorkoutNotification {
  title: string;
  body: string;
  url: string;
}

export async function sendNotification(
  userId: number,
  notification: WorkoutNotification
) {
  const res = await fetch(`/api/web-push/send/${userId}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(notification),
  });
  console.log(await res.json());
}

export async function sendWorkoutReminders() {
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