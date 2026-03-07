import { getGoalsFindByDateQueryOptions } from '@/features/goals-tracking/queries';
import { useGoalsTrackingDailyStore } from '@/features/goals-tracking/stores';
import { Box, LinearProgress } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';

function GoalsDailyProgress() {
  const date = useGoalsTrackingDailyStore((store) => store.date);

  const {
    data: { goals },
  } = useSuspenseQuery(getGoalsFindByDateQueryOptions(date));

  const completedGoals = goals.filter(({ done }) => done).length;
  const totalGoals = goals.length;
  const progress = (completedGoals / totalGoals) * 100;

  return (
    <Box sx={{ px: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

export default GoalsDailyProgress;
