import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekDeadline } from '@/features/happy-week/types';
import { formatCountdown, parseSnapshotIso, toCestDateKey, toCestTimeText } from '@/features/happy-week/utils';
import { Alert, Button, Divider, Stack, Typography } from '@mui/material';

interface HappyWeekDeadlineSheetProps {
  deadline: HappyWeekDeadline;
  now: Date;
}

function HappyWeekDeadlineSheet({ deadline, now }: HappyWeekDeadlineSheetProps) {
  const dismissedDeadlineIds = useHappyWeekStore((state) => state.dismissedDeadlineIds);
  const toggleDismissedDeadline = useHappyWeekStore((state) => state.toggleDismissedDeadline);

  const due = parseSnapshotIso(deadline.dueUtc);
  const countdown = formatCountdown(now, due);
  const isDismissed = dismissedDeadlineIds.includes(deadline.id);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="baseline">
        <Typography variant="h6" fontFamily="monospace">
          {toCestDateKey(due).slice(5)} {toCestTimeText(due)}
        </Typography>
        <Typography variant="body2" color={countdown ? 'error.main' : 'text.secondary'} fontWeight={700}>
          {countdown ? `${countdown} 남음` : '지났음'}
        </Typography>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        원문 표기: {deadline.dueRaw}
      </Typography>

      <Alert severity="error" variant="outlined" sx={{ py: 0.5 }}>
        <Typography variant="body2">{deadline.whatBreaks}</Typography>
      </Alert>

      {deadline.constraint && (
        <Alert severity="warning" variant="outlined" sx={{ py: 0.5 }}>
          <Typography variant="body2">{deadline.constraint}</Typography>
        </Alert>
      )}

      <Divider />

      <Stack spacing={0.5}>
        <Typography variant="body2">
          <Typography component="span" variant="caption" color="text.secondary">
            담당{' '}
          </Typography>
          {deadline.owner}
        </Typography>

        {deadline.costText && (
          <Typography variant="body2">
            <Typography component="span" variant="caption" color="text.secondary">
              비용{' '}
            </Typography>
            {deadline.costText}
          </Typography>
        )}

        {deadline.registerUrl && (
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            <Typography component="span" variant="caption" color="text.secondary">
              등록{' '}
            </Typography>
            {deadline.registerUrl}
            {deadline.registerPath ? ` · ${deadline.registerPath}` : ''}
          </Typography>
        )}
      </Stack>

      <Divider />

      {/*
        '완료' 버튼이 아니다. 앱은 실제로 처리했는지 알 수 없으므로 기록하지 않고,
        이 기기 화면에서만 숨긴다. 문구도 그렇게 적는다.
      */}
      <Button
        size="small"
        variant="outlined"
        color={isDismissed ? 'primary' : 'inherit'}
        onClick={() => toggleDismissedDeadline(deadline.id)}
      >
        {isDismissed ? '다시 보이기' : '이 기기에서 숨기기'}
      </Button>
      <Typography variant="caption" color="text.disabled">
        숨겨도 &quot;처리했다&quot;고 기록되지는 않는다. 실제 처리 여부는 앱이 알 수 없다.
      </Typography>
    </Stack>
  );
}

export default HappyWeekDeadlineSheet;
