import { toKstDateKey } from '@/lib';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
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

function GoalYearStatsCard({ year, goal }: GoalYearStatsCardProps) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const isCurrentYear = year === today.getFullYear();
  const referenceDate = useMemo(() => (isCurrentYear ? today : new Date(year, 11, 31)), [isCurrentYear, today, year]);

  const streak = useMemo(() => calculateStreak(goal.doneDates, referenceDate), [goal.doneDates, referenceDate]);
  const completedDays = goal.doneDates.length;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ pb: '16px !important', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            {goal.name}
          </Typography>
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
