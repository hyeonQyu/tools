import { DAYS, toKstDateKey } from '@/lib';
import { pxToRem } from '@/styles';
import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';

interface GoalHeatmapProps {
  year: number;
  doneDates: Date[];
  color: string;
  today: Date;
}

const CELL_SIZE = pxToRem(6);
const CELL_GAP = 2;

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
  const startDayOfWeek = jan1.getDay();

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = Array(startDayOfWeek).fill(null);

  const cursor = new Date(jan1);
  while (cursor <= dec31) {
    currentWeek.push(new Date(cursor));
    if (currentWeek.length === DAYS.length) {
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

function GoalHeatmap({ year, doneDates, color, today }: GoalHeatmapProps) {
  const { palette } = useTheme();

  const doneSet = useMemo(() => new Set(doneDates.map((d) => toKstDateKey(d))), [doneDates]);
  const weeks = useMemo(() => buildYearWeeks(year), [year]);
  const todayDateKey = useMemo(() => toKstDateKey(today), [today]);

  return (
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
                const isToday = todayDateKey === dateKey;

                return (
                  <Box
                    key={dayIndex}
                    sx={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      boxSizing: 'border-box',
                      borderRadius: '2px',
                      backgroundColor: isDone ? color : alpha(color, 0.1),
                      border: isToday ? `1px solid ${palette.grey[900]}` : 'none',
                    }}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default GoalHeatmap;
