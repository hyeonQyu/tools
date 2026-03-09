import { toKstDateKey } from '@/lib';
import { pxToRem } from '@/styles';
import { MoreVert } from '@mui/icons-material';
import { alpha, Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <Stack alignItems="center" spacing={0.25}>
      <Typography variant="body1" fontWeight={700} lineHeight={1.2}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}

interface GoalYearStatsCardProps {
  year: number;
  goal: {
    name: string;
    color: string;
    doneDates: Date[];
  };
}

const CELL_SIZE = pxToRem(6);
const CELL_GAP = 2;
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const getMonthLabel = (week: (Date | null)[]): string | null => {
  for (const day of week) {
    if (day && day.getDate() === 1) {
      return `${day.getMonth() + 1}월`;
    }
  }
  return null;
};

const buildYearWeeks = (year: number): (Date | null)[][] => {
  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);
  const startDayOfWeek = jan1.getDay(); // 0=Sun

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = Array(startDayOfWeek).fill(null);

  const cursor = new Date(jan1);
  while (cursor <= dec31) {
    currentWeek.push(new Date(cursor));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < DAYS.length) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return weeks;
};

const calculateStreak = (doneDates: Date[], referenceDate: Date): number => {
  const doneSet = new Set(doneDates.map((d) => toKstDateKey(d)));
  let streak = 0;
  const cursor = new Date(referenceDate);

  while (doneSet.has(toKstDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

function GoalYearStatsCard({ year, goal }: GoalYearStatsCardProps) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const isCurrentYear = year === today.getFullYear();
  const referenceDate = useMemo(() => (isCurrentYear ? today : new Date(year, 11, 31)), [isCurrentYear, today, year]);

  const yearStart = new Date(year, 0, 1);
  const totalDays = Math.floor((referenceDate.getTime() - yearStart.getTime()) / 86400000) + 1;

  const streak = useMemo(() => calculateStreak(goal.doneDates, referenceDate), [goal.doneDates, referenceDate]);
  const completedDays = goal.doneDates.length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const doneSet = useMemo(() => new Set(goal.doneDates.map((d) => toKstDateKey(d))), [goal.doneDates]);
  const weeks = useMemo(() => buildYearWeeks(year), [year]);

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ pb: '16px !important', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            {goal.name}
          </Typography>
          <IconButton size="small" edge="end">
            <MoreVert fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: 'space-around' }}>
          <StatItem label="현재 연속" value={`${streak}일`} />
          <StatItem label="완료 일수" value={`${completedDays}일`} />
          <StatItem label="완료율" value={`${completionRate}%`} />
        </Stack>

        <Box sx={{ overflowX: 'auto', pb: 1 }}>
          <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: `${CELL_GAP}px` }}>
            <Box sx={{ display: 'flex', gap: `${CELL_GAP}px`, pl: `calc(${CELL_SIZE} + ${CELL_GAP * 2}px)` }}>
              {weeks.map((week, weekIndex) => {
                const monthLabel = getMonthLabel(week);
                return (
                  <Box key={weekIndex} sx={{ width: CELL_SIZE, height: 12, flexShrink: 0, position: 'relative' }}>
                    {monthLabel && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          fontSize: pxToRem(8),
                          lineHeight: 1,
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                          top: 0,
                          left: 0,
                          width: pxToRem(16),
                        }}
                      >
                        {monthLabel}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', gap: `${CELL_GAP}px` }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${CELL_GAP}px`, mr: `${CELL_GAP}px` }}>
                {DAYS.map((day, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '7px', lineHeight: 1, color: 'text.secondary' }}>
                      {i % 2 === 0 ? day : ''}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {weeks.map((week, weekIndex) => (
                <Box key={weekIndex} sx={{ display: 'flex', flexDirection: 'column', gap: `${CELL_GAP}px` }}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <Box key={dayIndex} sx={{ width: CELL_SIZE, height: CELL_SIZE }} />;
                    }

                    const dateKey = toKstDateKey(day);
                    const isDone = doneSet.has(dateKey);

                    return (
                      <Box
                        key={dayIndex}
                        sx={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          borderRadius: '2px',
                          backgroundColor: isDone ? goal.color : alpha(goal.color, 0.1),
                        }}
                      />
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GoalYearStatsCard;
