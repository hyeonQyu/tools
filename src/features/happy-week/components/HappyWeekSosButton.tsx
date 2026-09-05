import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import HappyWeekEmergencySheet from '@/features/happy-week/components/HappyWeekEmergencySheet';
import { useHappyWeekNow } from '@/features/happy-week/hooks';
import { HappyWeekSnapshot } from '@/features/happy-week/types';
import { clampToTripRange, toCestDateKey } from '@/features/happy-week/utils';
import { SosOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface HappyWeekSosButtonProps {
  snapshot: HappyWeekSnapshot;
}

/**
 * 헤더 우측 상시 버튼. 하단 도크에 112 직통 링크를 두지 않은 이유는 오발신이다 —
 * 유럽에서 112 오발신은 실제 해악이다. 대신 시트를 한 번 거치고, 시트 맨 위에 112만 둔다.
 * 통화까지 2탭은 의도적으로 지불하는 비용이다.
 */
function HappyWeekSosButton({ snapshot }: HappyWeekSosButtonProps) {
  const dialog = useDialog();
  const now = useHappyWeekNow();

  // 다른 날을 보고 있어도 SOS는 '오늘' 기준이다. 사고는 보고 있는 날짜에 나지 않는다.
  const todayDateKey = clampToTripRange(snapshot, toCestDateKey(now));

  const open = () => {
    void dialog.open({
      title: '긴급',
      fullWidth: true,
      maxWidth: 'sm',
      keepMounted: true,
      slots: { transition: SlideUpTransition },
      content: () => <HappyWeekEmergencySheet snapshot={snapshot} dateKey={todayDateKey} />,
    });
  };

  return (
    <IconButton color="error" onClick={open} aria-label="긴급 연락처" sx={{ minWidth: 44, minHeight: 44 }}>
      <SosOutlined />
    </IconButton>
  );
}

export default HappyWeekSosButton;
