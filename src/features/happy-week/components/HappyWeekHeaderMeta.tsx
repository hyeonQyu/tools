import { useHappyWeekNow } from '@/features/happy-week/hooks';
import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekSnapshot } from '@/features/happy-week/types';
import { clampToTripRange, getDayByDateKey, getTripPhase, toCestDateKey, toCestTimeText } from '@/features/happy-week/utils';
import { Chip, Stack, Typography } from '@mui/material';

interface HappyWeekHeaderMetaProps {
  snapshot: HappyWeekSnapshot;
}

const RISK_COLOR = {
  critical: 'error',
  transfer: 'warning',
  normal: 'default',
} as const;

/** 헤더 2행: 현지 시각 + 며칠차·날짜·머무는 도시. 어떤 날에도 2행을 넘지 않는다. */
function HappyWeekHeaderMeta({ snapshot }: HappyWeekHeaderMetaProps) {
  const now = useHappyWeekNow();
  const viewDateKey = useHappyWeekStore((state) => state.viewDateKey);

  const todayDateKey = toCestDateKey(now);
  const activeDateKey = clampToTripRange(snapshot, viewDateKey);
  const day = getDayByDateKey(snapshot, activeDateKey);
  const phase = getTripPhase(todayDateKey);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
      {day && (
        <>
          <Chip size="small" label={`${day.dayNo}일차`} color={RISK_COLOR[day.riskLevel]} />
          <Chip size="small" variant="outlined" label={`${activeDateKey.slice(5)} (${day.weekday})`} />
          {day.stayCity && <Chip size="small" variant="outlined" label={day.stayCity} />}
        </>
      )}

      {activeDateKey !== todayDateKey && phase === 'during' && (
        <Chip size="small" color="info" variant="outlined" label={`오늘은 ${todayDateKey.slice(5)}`} />
      )}

      {phase === 'before' && <Chip size="small" color="info" label="여행 시작 전" />}
      {phase === 'after' && <Chip size="small" label="여행 종료" />}

      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
        현지 {toCestTimeText(now)}
      </Typography>
    </Stack>
  );
}

export default HappyWeekHeaderMeta;
