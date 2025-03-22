'use client';

import { sendNotification } from '@/app/models/Push';

export function AdminDashboard() {
  return (
    <div className="flex flex-col">
      <button
        className="bg-gray-800 text-white p-1 rounded-2xl m-5"
        onClick={() => {
          sendNotification(2, {
            title: 'test',
            body: 'test body',
            url: `${process.env.NEXT_PUBLIC_URL}/workout?id=1`,
          });
        }}
      >
        Send a push notification
      </button>
      <button
        className="bg-gray-800 text-white p-1 rounded-2xl m-5"
        onClick={() => {
          fetch('/api/web-push/remind', {
            method: 'POST',
          });
        }}
      >
        Send out workout reminders
      </button>
    </div>
  );
}
