import { firebase, firebaseConfig } from '@/firebase';
import { MessagePayload, Messaging, getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const SERVICE_WORKER_PATH = '/firebase-messaging-sw.js';
/** FCM 기본 스코프. 앱 전체를 제어하는 PWA 서비스워커와 분리하기 위해 별도 스코프로 등록한다. */
const SERVICE_WORKER_SCOPE = '/firebase-cloud-messaging-push-scope';

const VAPID_KEY: string = import.meta.env.VITE_FIREBASE_VAPID_KEY ?? '';

let messaging: Messaging | null = null;

/** `getMessaging`은 지원하지 않는 브라우저에서 예외를 던지므로 `checkIsMessagingSupported` 확인 후에만 호출한다. */
const getMessagingInstance = (): Messaging => {
  messaging ??= getMessaging(firebase.app);
  return messaging;
};

export const checkIsMessagingSupported = (): Promise<boolean> => isSupported();

export const checkHasVapidKey = (): boolean => VAPID_KEY.length > 0;

/**
 * 서비스워커는 정적 파일이라 빌드타임 env를 주입받을 수 없다.
 * 등록 URL의 쿼리스트링으로 Firebase 설정을 넘겨 서비스워커가 직접 파싱하게 한다.
 */
export const registerMessagingServiceWorker = (): Promise<ServiceWorkerRegistration> => {
  const params = new URLSearchParams({
    apiKey: `${firebaseConfig.apiKey ?? ''}`,
    authDomain: `${firebaseConfig.authDomain ?? ''}`,
    projectId: `${firebaseConfig.projectId ?? ''}`,
    messagingSenderId: `${firebaseConfig.messagingSenderId ?? ''}`,
    appId: `${firebaseConfig.appId ?? ''}`,
  });

  return navigator.serviceWorker.register(`${SERVICE_WORKER_PATH}?${params.toString()}`, { scope: SERVICE_WORKER_SCOPE });
};

export const issuePushToken = (serviceWorkerRegistration: ServiceWorkerRegistration): Promise<string> =>
  getToken(getMessagingInstance(), { vapidKey: VAPID_KEY, serviceWorkerRegistration });

/** 앱이 포그라운드일 때는 브라우저 알림이 뜨지 않으므로 직접 처리해야 한다. */
export const subscribeForegroundMessage = (handler: (payload: MessagePayload) => void): (() => void) =>
  onMessage(getMessagingInstance(), handler);
