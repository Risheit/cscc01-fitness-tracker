self.addEventListener('install', () => {
  console.info('service worker installed.');
});

const sendDeliveryReportAction = () => {
  console.log('Web push delivered.');
};

self.addEventListener('push', function (event) {
  console.log('we received a push', event.data);
  if (!event.data) {
    return;
  }

  const payload = event.data.json();
  const { title, body } = payload;
  const notificationTitle = title ?? 'Hi';

  event.waitUntil(
    self.registration
      .showNotification(notificationTitle, {
        body,
      })
      .then(() => {
        sendDeliveryReportAction();
      })
  );
});
