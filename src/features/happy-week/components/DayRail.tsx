import { HappyWeekItem } from '@/features/happy-week/types';
import { getTzBadge, parseSnapshotIso, toCestTimeText } from '@/features/happy-week/utils';
import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';

interface DayRailProps {
  items: HappyWeekItem[];
  now: Date;
  /** 오늘을 보고 있을 때만 NOW 라인을 긋는다. 다른 날에 빨간 선이 있으면 거짓말이 된다. */
  showNowLine: boolean;
  onSelectItem: (item: HappyWeekItem) => void;
}

const SEVERITY_BORDER = {
  hard: 'error.main',
  warn: 'warning.main',
  info: 'divider',
} as const;

const TIME_COLUMN_WIDTH = 52;

function NowLine({ now }: { now: Date }) {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        my: 0.5,
      }}
    >
      <Typography variant="caption" fontFamily="monospace" color="error.main" fontWeight={700} sx={{ flexShrink: 0 }}>
        {toCestTimeText(now)}
      </Typography>
      <Box sx={{ flex: 1, height: '2px', bgcolor: 'error.main' }} />
      <Typography variant="caption" color="error.main" fontWeight={700} sx={{ flexShrink: 0 }}>
        지금
      </Typography>
    </Box>
  );
}

function DayRail({ items, now, showNowLine, onSelectItem }: DayRailProps) {
  if (items.length === 0) return null;

  const nowMs = now.getTime();
  const nowLineIndex = showNowLine
    ? items.findIndex((item) => item.startUtc !== null && parseSnapshotIso(item.startUtc).getTime() > nowMs)
    : -1;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `${TIME_COLUMN_WIDTH}px 1fr`, columnGap: 1.5, rowGap: 1 }}>
      {items.map((item, index) => {
        const tzBadge = getTzBadge(item.tz);
        const isPast = item.startUtc !== null && parseSnapshotIso(item.startUtc).getTime() <= nowMs;
        // timeRaw는 '18:40 AMS 도착 → 시내 20시 전후'나 '시각 미기록'처럼 문장인 경우가 있다.
        // 52px 열은 시각만 담고, 문장은 카드 본문이 맡는다.
        const rawLead = item.timeRaw.match(/^\d{1,2}:\d{2}/)?.[0] ?? null;
        const timeText = item.startUtc ? toCestTimeText(parseSnapshotIso(item.startUtc)) : (rawLead ?? '—');
        const showRawInCard = !item.startUtc && item.timeRaw && item.timeRaw !== timeText;

        return (
          <Fragment key={item.id}>
            {showNowLine && index === nowLineIndex && <NowLine now={now} />}

            <Box sx={{ position: 'relative', pt: 0.75 }}>
              <Typography
                variant="caption"
                fontFamily="monospace"
                color={isPast && showNowLine ? 'text.disabled' : 'text.secondary'}
                sx={{ display: 'block', lineHeight: 1.2 }}
              >
                {timeText}
              </Typography>
              {tzBadge && (
                <Typography variant="caption" color="warning.main" sx={{ display: 'block', fontSize: '0.65rem', lineHeight: 1.2 }}>
                  {tzBadge}
                </Typography>
              )}
            </Box>

            <Card
              variant="outlined"
              onClick={() => onSelectItem(item)}
              sx={{
                p: 1.25,
                cursor: 'pointer',
                borderColor: SEVERITY_BORDER[item.severity],
                borderWidth: item.severity === 'hard' ? 2 : 1,
                opacity: item.flags.excluded ? 0.5 : isPast && showNowLine ? 0.6 : 1,
                textDecoration: item.flags.excluded ? 'line-through' : undefined,
              }}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                  {item.icon && <Typography component="span">{item.icon}</Typography>}
                  <Typography variant="body2" fontWeight={600}>
                    {item.title}
                  </Typography>
                  {item.flags.draft && <Chip size="small" label="검토안" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />}
                  {item.munichCarCandidate && (
                    <Chip size="small" label="후보" color="warning" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                  )}
                </Stack>

                {/* 시각 열이 담지 못한 원문 표기를 여기서 살린다 */}
                {showRawInCard && (
                  <Typography variant="caption" color="text.secondary" fontFamily="monospace" sx={{ display: 'block' }}>
                    {item.timeRaw}
                  </Typography>
                )}

                {item.latestDepart && (
                  <Typography variant="caption" color="error.main" fontWeight={700}>
                    ⚠️ {item.latestDepart.label}
                  </Typography>
                )}

                {item.headline && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {item.headline}
                  </Typography>
                )}
              </Stack>
            </Card>
          </Fragment>
        );
      })}

      {/* 남은 일정이 없으면 레일 끝에 NOW 라인을 둔다 */}
      {showNowLine && nowLineIndex === -1 && <NowLine now={now} />}
    </Box>
  );
}

export default DayRail;
