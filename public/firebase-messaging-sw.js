/**
 * FCM 백그라운드 메시지 전용 서비스워커.
 *
 * `public/` 정적 파일이라 빌드타임에 Vite env를 주입받을 수 없다.
 * 등록 시 쿼리스트링으로 전달된 Firebase 설정을 `self.location`에서 직접 파싱한다.
 * (`src/features/push/utils/messaging.utils.ts`의 `registerMessagingServiceWorker` 참고)
 *
 * 서버(`functions/src/push/sendPush.ts`)는 반드시 **데이터 전용** 메시지를 보낸다.
 * `notification` 키가 실리면 FCM SDK가 알림을 자동 표시한 뒤 `onBackgroundMessage`까지 호출해
 * 같은 알림이 2개 뜨고, SDK의 `notificationclick`이 `stopImmediatePropagation()`으로 아래 핸들러를
 * 선점한 채 외부 도메인 링크를 차단한다.
 */
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

const DEFAULT_NOTIFICATION_TITLE = '알림';
const NOTIFICATION_ICON = '/icon-192x192.png';

const searchParams = new URL(self.location).searchParams;

const firebaseConfig = {
  apiKey: searchParams.get('apiKey'),
  authDomain: searchParams.get('authDomain'),
  projectId: searchParams.get('projectId'),
  messagingSenderId: searchParams.get('messagingSenderId'),
  appId: searchParams.get('appId'),
};

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId && firebaseConfig.appId) {
  firebase.initializeApp(firebaseConfig);

  firebase.messaging().onBackgroundMessage((payload) => {
    const data = payload.data || {};

    self.registration.showNotification(data.title || DEFAULT_NOTIFICATION_TITLE, {
      body: data.body || '',
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_ICON,
      ...(data.tag ? { tag: data.tag } : {}),
      data: { link: data.link || '/' },
    });
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const link = (event.notification.data && event.notification.data.link) || '/';
  const targetUrl = new URL(link, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

      // 같은 주소가 이미 열려 있으면 그 창을 그대로 포커스한다.
      const exact = clientList.find((client) => client.url === targetUrl);
      if (exact) {
        await exact.focus();
        return;
      }

      // `WindowClient.navigate()`는 이 서비스워커가 제어하는 창에서만 동작한다.
      // 이 워커의 스코프는 `/firebase-cloud-messaging-push-scope`라 앱 창(`/`)을 제어하지 않으므로
      // 항상 새 창으로 연다. (예매 링크는 어차피 외부 도메인이라 이동 자체가 불가능하다)
      await self.clients.openWindow(targetUrl);
    })(),
  );
});
