import { PushNotificationState } from '@/features/push';
import { Alert, AlertTitle, Button } from '@mui/material';

interface CgvPushPermissionCardProps {
  /** `usePushNotification`은 부수효과가 있어 화면당 한 번만 호출한다. 소유자가 내려 준다. */
  push: PushNotificationState;
}

/** 알림이 실제로 도착할 수 있는 상태인지 안내한다. 정상 상태(권한 허용)에서는 아무것도 렌더링하지 않는다. */
function CgvPushPermissionCard({ push }: CgvPushPermissionCardProps) {
  const { isSupported, isStandalone, isIos, permission, isRegistering, error, requestPermission } = push;

  if (permission === 'granted' && !error) return null;

  if (isIos && !isStandalone) {
    return (
      <Alert severity="warning">
        <AlertTitle>홈 화면에 추가해 주세요</AlertTitle>
        iOS는 Safari 탭에서 푸시 알림을 받을 수 없습니다. 공유 버튼 → &ldquo;홈 화면에 추가&rdquo;로 설치한 뒤 앱으로 실행해 주세요. (iOS
        16.4 이상 필요)
      </Alert>
    );
  }

  if (!isSupported) {
    return (
      <Alert severity="warning">
        <AlertTitle>알림을 사용할 수 없습니다</AlertTitle>이 브라우저는 웹 푸시를 지원하지 않습니다. 감시 항목은 저장되지만 알림은 오지
        않습니다.
      </Alert>
    );
  }

  if (permission === 'denied') {
    return (
      <Alert severity="error">
        <AlertTitle>알림 권한이 차단되어 있습니다</AlertTitle>
        브라우저 사이트 설정에서 알림 권한을 허용으로 변경해 주세요.
      </Alert>
    );
  }

  return (
    <Alert
      severity={error ? 'error' : 'info'}
      action={
        <Button color="inherit" size="small" onClick={requestPermission} disabled={isRegistering}>
          {isRegistering ? '등록 중' : '알림 켜기'}
        </Button>
      }
    >
      <AlertTitle>알림이 꺼져 있습니다</AlertTitle>
      {error ?? '예매 오픈 알림을 받으려면 이 기기에서 알림을 켜주세요.'}
    </Alert>
  );
}

export default CgvPushPermissionCard;
