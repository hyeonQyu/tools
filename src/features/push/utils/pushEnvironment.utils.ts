/** iPadOS 13+는 데스크톱 Safari로 위장하므로 터치 포인트로 함께 판별한다. */
export const checkIsIos = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

/** 홈 화면에 추가된 PWA로 실행 중인지. iOS는 이 상태에서만 웹 푸시가 동작한다(16.4+). */
export const checkIsStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return 'standalone' in navigator && navigator.standalone === true;
};

export const checkIsNotificationSupported = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

export const getNotificationPermission = (): NotificationPermission =>
  checkIsNotificationSupported() ? Notification.permission : 'default';
