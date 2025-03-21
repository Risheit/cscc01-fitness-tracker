// Code taken and modified from https://github.com/ameerezae/web-push-nextjs/

import webpush from 'web-push';

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
  console.log('Sending push...');
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/web-push/send/${userId}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(notification),
  });
  console.log(await res.json());
}