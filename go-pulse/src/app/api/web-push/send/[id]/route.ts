import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { subscriptions } from '@/app/models/Push';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  webpush.setVapidDetails(
    'mailto:mail@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const userId = parseInt((await params).id, 10);

  if (!userId) {
    return NextResponse.json(
      { message: 'could not identify user' },
      { status: 500 }
    );
  }

  const subscription = subscriptions[userId];
  if (!subscription) {
    return NextResponse.json(
      { message: 'user has not allowed notifications' },
      { status: 200 }
    );
  }

  console.log('sending subscription', subscription);
  try {
    const { title, body, url } = await req.json();
    if (!title || !body || !url) {
      return NextResponse.json(
        { message: 'missing/invalid notification title or body' },
        { status: 400 }
      );
    }
    const notification = await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, url })
    );

    return NextResponse.json(
      { message: 'sent notification!', notification: notification },
      { status: 200 }
    );
  } catch (e) {
    console.log('error sending notification: ', e);
    return NextResponse.json(
      { message: 'could not send notification' },
      { status: 500 }
    );
  }
}
