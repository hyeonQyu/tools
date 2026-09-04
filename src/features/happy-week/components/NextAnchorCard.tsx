import { HappyWeekItem } from '@/features/happy-week/types';
import { formatCountdown, parseSnapshotIso, toCestTimeText } from '@/features/happy-week/utils';
import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';

interface NextAnchorCardProps {
  item: HappyWeekItem;
  now: Date;
  /** 진행바의 기준이 되는 직전 앵커 시각. 없으면 그날 자정부터 잰다. */
  previousAtUtc: string | null;
  onClick: (item: HappyWeekItem) => void;
}

const SEVERITY_COLOR = {
  hard: 'error.main',
  warn: 'warning.main',
  info: 'divider',
} as const;

/**
 * "다음에 뭐가 오고 몇 분 남았나". 레일 최상단에 sticky로 붙는다.
 * 앱을 여는 행위 자체가 이 질문에 대한 답이 되어야 한다.
 */
function NextAnchorCard({ item, now, previousAtUtc, onClick }: NextAnchorCardProps) {
  if (!item.startUtc) return null;

  const startDate = parseSnapshotIso(item.startUtc);
  const countdown = formatCountdown(now, startDate);

  const fromMs = previousAtUtc ? parseSnapshotIso(previousAtUtc).getTime() : startDate.getTime() - 3 * 60 * 60 * 1000;
  const span = startDate.getTime() - fromMs;
  const elapsed = now.getTime() - fromMs;
  const progress = span > 0 ? Math.min(100, Math.max(0, (elapsed / span) * 100)) : 0;

  const deadlineLabel = item.latestDepart
    ? `${item.latestDepart.label}${countdown ? '' : ' — 지났음'}`
    : item.window?.overrun === 'lost'
      ? item.window.overrunText
      : null;

  return (
    <Card
      variant="outlined"
      onClick={() => onClick(item)}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        borderColor: SEVERITY_COLOR[item.severity],
        borderWidth: item.severity === 'hard' ? 2 : 1,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
            {item.icon && <Typography component="span">{item.icon}</Typography>}
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {item.title}
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            fontFamily="monospace"
            sx={{ flexShrink: 0, color: item.severity === 'hard' ? 'error.main' : 'text.primary' }}
          >
            {countdown ? `⏱ ${countdown}` : '진행 중'}
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progress}
          color={item.severity === 'hard' ? 'error' : item.severity === 'warn' ? 'warning' : 'primary'}
          sx={{ height: 6, borderRadius: 1 }}
        />

        <Box>
          <Typography variant="body2" color="text.secondary">
            {toCestTimeText(startDate)}
            {item.timeRaw && item.timeRaw !== toCestTimeText(startDate) ? ` · ${item.timeRaw}` : ''}
          </Typography>

          {deadlineLabel && (
            <Typography variant="body2" fontWeight={600} color="error.main">
              {deadlineLabel}
            </Typography>
          )}

          {item.headline && (
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {item.headline}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
}

export default NextAnchorCard;
