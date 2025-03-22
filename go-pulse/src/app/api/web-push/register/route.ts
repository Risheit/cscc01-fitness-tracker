import { NextResponse } from 'next/server';
import checkAuth from '../../check-auth/CheckAuth';
import webpush from 'web-push';
import { subscriptions } from '@/app/models/Push';

export async function POST(req: Request) {
  const authData = await checkAuth(req);
  if (!authData.authenticated) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  const userId = authData.userId;
  const body: { subscription: webpush.PushSubscription } = await req.json();

  if (!body.subscription || !userId) {
    return NextResponse.json(
      { message: 'no subscription given' },
      { status: 400 }
    );
  }

  subscriptions[userId] = body.subscription;
  return NextResponse.json(
    { message: 'registered for notifications!' },
    { status: 200 }
  );
}
