import { pushTokenService } from '@/features/push/data';
import { enqueueClosableSnackbar } from '@/styles';
import { useCallback, useEffect, useState } from 'react';

/**
 * 이 기기의 워치 알림 설정.
 *
 * 설정 값은 서버가 푸시 페이로드에 실어 보내고(`functions/src/push/sendPush.ts`),
 * 서비스워커가 알림 옵션에 반영한다(`public/firebase-messaging-sw.js`).
 * 워치는 기기마다 다르므로 사용자 단위가 아니라 FCM 토큰(=기기) 단위로 저장한다.
 */
export const usePushWatchAlert = (token: string | null) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isActive = true;

    const load = async () => {
      try {
        const watchAlert = await pushTokenService.getWatchAlert(token);
        if (!isActive) return;
        setIsEnabled(watchAlert);
      } catch (error) {
        // 사용자가 명시적으로 요청한 동작이 아니므로 화면에 에러를 띄우지 않는다.
        console.error('워치 알림 설정을 불러오지 못했습니다.', error);
      } finally {
        if (isActive) setIsLoaded(true);
      }
    };
    load();

    return () => {
      isActive = false;
    };
  }, [token]);

  const toggle = useCallback(
    async (nextEnabled: boolean) => {
      if (!token) return;

      // 낙관적으로 먼저 반영하고, 실패하면 되돌린다. 스위치가 눌리지 않는 것처럼 보이는 상황을 막는다.
      setIsEnabled(nextEnabled);
      setIsSaving(true);

      try {
        await pushTokenService.setWatchAlert(token, nextEnabled);
      } catch (error) {
        setIsEnabled(!nextEnabled);
        enqueueClosableSnackbar({ variant: 'error', message: '워치 알림 설정을 저장하지 못했습니다.' });
        console.error('워치 알림 설정 저장에 실패했습니다.', error);
      } finally {
        setIsSaving(false);
      }
    },
    [token],
  );

  return { isEnabled, isLoaded, isSaving, toggle };
};
