import webpush from 'web-push';

export interface UserSubscription {
  [userId: number]: webpush.PushSubscription;
} 

export const subscriptions: UserSubscription = {};

