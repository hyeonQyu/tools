import { toKstDateKey } from '@/lib';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { HTMLAttributes, useMemo } from 'react';
import GoalHeatmap from './GoalHeatmap';
import GoalMenuButton from './GoalMenuButton';
import GoalStatItem from './GoalStatItem';

interface GoalYearStatsCardProps {
  year: number;
  goal: {
    id: string;
    name: string;
    color: string;
    doneDates: Date[];
  };
  dragHandleProps?: HTMLAttributes<HTMLElement>;
}

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

function GoalYearStatsCard({ year, goal, dragHandleProps }: GoalYearStatsCardProps) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const yesterday = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d;
  }, [today]);

  const isCurrentYear = year === today.getFullYear();
  const referenceDate = useMemo(() => (isCurrentYear ? yesterday : new Date(year, 11, 31)), [isCurrentYear, yesterday, year]);

  const streak = useMemo(() => calculateStreak(goal.doneDates, referenceDate), [goal.doneDates, referenceDate]);
  const completedDays = goal.doneDates.length;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ pb: '16px !important', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Box {...dragHandleProps} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
              <DragIndicatorIcon color="action" fontSize="small" />
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {goal.name}
            </Typography>
          </Stack>
          <GoalMenuButton goalId={goal.id} />
        </Stack>

        <Stack direction="row" sx={{ justifyContent: 'space-around' }}>
          <GoalStatItem label="현재 연속" value={`${streak}일`} />
          <GoalStatItem label="완료 일수" value={`${completedDays}일`} />
        </Stack>

        <GoalHeatmap year={year} doneDates={goal.doneDates} color={goal.color} today={today} />
      </CardContent>
    </Card>
  );
}

export default GoalYearStatsCard;
