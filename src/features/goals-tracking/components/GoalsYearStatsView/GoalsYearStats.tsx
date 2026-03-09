import { GoalYearStatsCard } from '@/features/goals-tracking/components/GoalYearStatsCard';
import { useYearlyGoals } from '@/features/goals-tracking/hooks';
import { useGoalsTrackingYearStore } from '@/features/goals-tracking/stores';
import { Stack } from '@mui/material';

function GoalsYearStats() {
  const year = useGoalsTrackingYearStore((store) => store.year);
  const goals = useYearlyGoals(year);

  return (
    <Stack gap={1.6}>
      {goals.map(({ goal, doneDates }) => (
        <GoalYearStatsCard key={goal.id} year={year} goal={{ ...goal, doneDates }} />
      ))}
    </Stack>
  );
}

export default GoalsYearStats;
