self.addEventListener('install', () => {
  console.info('service worker installed.');
});

self.addEventListener('push', (e) => {
  if (!e.data) {
    return;
  }

  const payload = e.data.json();
  const { title, body, url } = payload;
  const notificationTitle = title ?? 'Hi';

  e.waitUntil(
    self.registration
      .showNotification(notificationTitle, {
        body,
        requireInteraction: true,
        renotify: true,
        tag: 'workout-reminder',
        data: { url },
      })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  clients.openWindow(e.notification.data.url);
})
