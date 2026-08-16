import { pushTokenService } from '@/features/push/data';
import {
  checkHasVapidKey,
  checkIsIos,
  checkIsMessagingSupported,
  checkIsNotificationSupported,
  checkIsStandalone,
  getNotificationPermission,
  issuePushToken,
  registerMessagingServiceWorker,
  subscribeForegroundMessage,
} from '@/features/push/utils';
import { enqueueClosableSnackbar } from '@/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ERROR_MESSAGE = {
  unsupported: '이 브라우저에서는 푸시 알림을 사용할 수 없습니다.',
  iosNotStandalone: 'iOS에서는 홈 화면에 추가한 뒤 앱으로 실행해야 알림을 받을 수 있습니다.',
  missingVapidKey: '푸시 알림 설정(VAPID 키)이 누락되어 알림을 등록할 수 없습니다.',
  permissionDenied: '알림 권한이 허용되지 않았습니다. 브라우저 설정에서 권한을 변경해 주세요.',
  tokenIssueFailed: '푸시 토큰을 발급받지 못했습니다. 잠시 후 다시 시도해 주세요.',
  registerFailed: '알림 등록에 실패했습니다.',
} as const;

export const usePushNotification = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIos = useMemo(checkIsIos, []);
  const isStandalone = useMemo(checkIsStandalone, []);

  useEffect(() => {
    let isActive = true;

    const resolveSupport = async () => {
      const supported = checkIsNotificationSupported() && (await checkIsMessagingSupported().catch(() => false));
      if (isActive) setIsSupported(supported);
    };
    resolveSupport();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isSupported || permission !== 'granted') return;

    return subscribeForegroundMessage(({ data }) => {
      // 서버는 데이터 전용 메시지를 보낸다. (`public/firebase-messaging-sw.js` 주석 참고)
      const message = [data?.title, data?.body].filter(Boolean).join(' - ');
      if (!message) return;
      enqueueClosableSnackbar({ variant: 'info', message });
    });
  }, [isSupported, permission]);

  /**
   * 이미 권한이 있으면 앱을 열 때마다 토큰을 다시 발급해 저장한다.
   * FCM 토큰은 브라우저가 임의로 회전시키고, 최초 등록 시 Firestore 쓰기가 실패했을 수도 있다.
   * 이 보정이 없으면 서버가 만료 토큰을 지운 뒤 등록된 토큰이 0개가 되어,
   * 화면상으로는 권한이 허용된 정상 상태인데 알림만 조용히 끊긴다.
   */
  useEffect(() => {
    if (!isSupported || permission !== 'granted' || !checkHasVapidKey()) return;
    if (isIos && !isStandalone) return;

    let isActive = true;

    const refreshToken = async () => {
      try {
        const registration = await registerMessagingServiceWorker();
        const token = await issuePushToken(registration);
        if (!isActive || !token) return;
        await pushTokenService.register({ token, userAgent: navigator.userAgent });
      } catch (e) {
        // 사용자가 명시적으로 요청한 동작이 아니므로 화면에 에러를 띄우지 않는다.
        console.error('푸시 토큰 갱신에 실패했습니다.', e);
      }
    };
    refreshToken();

    return () => {
      isActive = false;
    };
  }, [isIos, isStandalone, isSupported, permission]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError(ERROR_MESSAGE.unsupported);
      return;
    }
    if (isIos && !isStandalone) {
      setError(ERROR_MESSAGE.iosNotStandalone);
      return;
    }
    if (!checkHasVapidKey()) {
      setError(ERROR_MESSAGE.missingVapidKey);
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);
      if (nextPermission !== 'granted') {
        setError(ERROR_MESSAGE.permissionDenied);
        return;
      }

      const registration = await registerMessagingServiceWorker();
      const token = await issuePushToken(registration);
      if (!token) {
        setError(ERROR_MESSAGE.tokenIssueFailed);
        return;
      }

      await pushTokenService.register({ token, userAgent: navigator.userAgent });
    } catch (e) {
      setError(e instanceof Error ? e.message : ERROR_MESSAGE.registerFailed);
    } finally {
      setIsRegistering(false);
    }
  }, [isIos, isStandalone, isSupported]);

  return { isSupported, isStandalone, isIos, permission, isRegistering, error, requestPermission };
};
