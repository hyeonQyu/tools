import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import HappyWeekDeadlineSheet from '@/features/happy-week/components/HappyWeekDeadlineSheet';
import { useHappyWeekNow } from '@/features/happy-week/hooks';
import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekDeadline, HappyWeekSnapshot } from '@/features/happy-week/types';
import {
  formatCountdown,
  getActionableDeadlines,
  getDaySeverity,
  getItemsForDay,
  parseSnapshotIso,
  toCestDateKey,
  toCestTimeText,
} from '@/features/happy-week/utils';
import { ChevronRight } from '@mui/icons-material';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

interface HappyWeekTripRailViewProps {
  snapshot: HappyWeekSnapshot;
}

const RISK_COLOR = {
  critical: 'error.main',
  transfer: 'warning.main',
  normal: 'divider',
} as const;

const COUNTRY_FLAG = { NL: '🇳🇱', DE: '🇩🇪', IT: '🇮🇹', AIR: '✈️' } as const;

/**
 * 한 단계 줌아웃. 14일을 한 화면에 놓고 "언제 어디에 있고 어느 날이 위험한가"만 본다.
 * 행을 누르면 그 날의 레일로 간다. 상세는 여기 두지 않는다.
 */
function HappyWeekTripRailView({ snapshot }: HappyWeekTripRailViewProps) {
  const now = useHappyWeekNow();
  const dialog = useDialog();
  const munichCarDay = useHappyWeekStore((state) => state.munichCarDay);
  const dismissedDeadlineIds = useHappyWeekStore((state) => state.dismissedDeadlineIds);
  const setViewDateKey = useHappyWeekStore((state) => state.setViewDateKey);

  const todayDateKey = toCestDateKey(now);

  const rows = useMemo(
    () =>
      snapshot.days.map((day) => {
        const items = getItemsForDay(snapshot, day.dateKey, munichCarDay);
        const hardCount = items.filter((item) => item.severity === 'hard').length;
        const firstTimed = items.find((item) => item.startUtc !== null);
        return { day, itemCount: items.length, hardCount, severity: getDaySeverity(items), firstTimed };
      }),
    [snapshot, munichCarDay],
  );

  const deadlines = useMemo(() => getActionableDeadlines(snapshot, dismissedDeadlineIds), [snapshot, dismissedDeadlineIds]);

  const openDeadlineSheet = (deadline: HappyWeekDeadline) => {
    void dialog.open({
      title: deadline.title,
      fullWidth: true,
      maxWidth: 'sm',
      slots: { transition: SlideUpTransition },
      content: () => <HappyWeekDeadlineSheet deadline={deadline} now={now} />,
    });
  };

  // 도시가 바뀌는 행 위에 구분선을 긋는다. 구간 조망의 핵심은 "어디에 있나"다.
  const cityChangesBefore = new Set<string>();
  rows.forEach((row, index) => {
    const prev = rows[index - 1];
    if (prev && prev.day.stayCity !== row.day.stayCity) cityChangesBefore.add(row.day.dateKey);
  });

  return (
    <>
      <Stack spacing={0.75}>
        {rows.map(({ day, itemCount, hardCount, severity, firstTimed }) => {
          const isToday = day.dateKey === todayDateKey;
          const isPast = day.dateKey < todayDateKey;

          return (
            <Box key={day.dateKey}>
              {cityChangesBefore.has(day.dateKey) && (
                <Divider sx={{ my: 0.75 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {COUNTRY_FLAG[day.country]} {day.stayCity ?? '이동'}
                  </Typography>
                </Divider>
              )}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                onClick={() => setViewDateKey(day.dateKey)}
                sx={(theme) => ({
                  cursor: 'pointer',
                  px: 1.25,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: theme.glass.controlBackground,
                  border: '1px solid',
                  borderColor: isToday ? 'error.main' : theme.glass.sheetBorder,
                  borderLeft: `4px solid`,
                  borderLeftColor: RISK_COLOR[day.riskLevel],
                  opacity: isPast ? 0.55 : 1,
                })}
              >
                <Box sx={{ width: 44, flexShrink: 0 }}>
                  <Typography variant="body2" fontWeight={700} fontFamily="monospace" lineHeight={1.1}>
                    {day.dayNo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" lineHeight={1.1}>
                    {day.dateKey.slice(5)} {day.weekday}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {day.character}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
                    {firstTimed?.startUtc && (
                      <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                        첫 일정 {toCestTimeText(parseSnapshotIso(firstTimed.startUtc))}
                      </Typography>
                    )}
                    {itemCount > 0 && <Chip size="small" label={`${itemCount}건`} sx={{ height: 18, fontSize: '0.65rem' }} />}
                    {hardCount > 0 && (
                      <Chip
                        size="small"
                        color="error"
                        variant="outlined"
                        label={`놓치면 안 됨 ${hardCount}`}
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    )}
                    {day.isDrivingDay && <Chip size="small" label="🚗 운전" sx={{ height: 18, fontSize: '0.65rem' }} />}
                    {day.planDepth === 'candidates' && (
                      <Chip size="small" variant="outlined" label="자유" sx={{ height: 18, fontSize: '0.65rem' }} />
                    )}
                  </Stack>
                </Box>

                {severity === 'hard' && !isPast && (
                  <Typography component="span" sx={{ flexShrink: 0 }}>
                    ⚠️
                  </Typography>
                )}
                <ChevronRight sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {deadlines.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.75 }}>
            마감 전체 ({deadlines.length})
          </Typography>
          <Stack spacing={0.5}>
            {deadlines.map((deadline) => {
              const due = parseSnapshotIso(deadline.dueUtc);
              const countdown = formatCountdown(now, due);
              return (
                <Stack
                  key={deadline.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  onClick={() => openDeadlineSheet(deadline)}
                  sx={(theme) => ({
                    cursor: 'pointer',
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: theme.glass.controlBackground,
                    border: `1px solid ${theme.glass.sheetBorder}`,
                    opacity: countdown ? 1 : 0.55,
                  })}
                >
                  <Typography variant="caption" fontFamily="monospace" color="text.secondary" sx={{ width: 44, flexShrink: 0 }}>
                    {toCestDateKey(due).slice(5)}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0 }}>
                    {deadline.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontFamily="monospace"
                    fontWeight={700}
                    color={countdown ? 'error.main' : 'text.disabled'}
                    sx={{ flexShrink: 0 }}
                  >
                    {countdown ?? '지남'}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      )}
    </>
  );
}

export default HappyWeekTripRailView;
