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

  const yearStart = new Date(year, 0, 1);
  const totalDays = Math.floor((referenceDate.getTime() - yearStart.getTime()) / 86400000) + 1;

  const streak = useMemo(() => calculateStreak(goal.doneDates, referenceDate), [goal.doneDates, referenceDate]);
  const completedDays = goal.doneDates.length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

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
          <GoalStatItem label="완료율" value={`${completionRate}%`} />
        </Stack>

        <GoalHeatmap year={year} doneDates={goal.doneDates} color={goal.color} />
      </CardContent>
    </Card>
  );
}

export default GoalYearStatsCard;
