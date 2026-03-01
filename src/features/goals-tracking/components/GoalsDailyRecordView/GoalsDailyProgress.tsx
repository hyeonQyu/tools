import { useDailyGoals } from '@/features/goals-tracking/hooks';
import { useGoalsTrackingDailyStore } from '@/features/goals-tracking/stores';
import { Box, LinearProgress } from '@mui/material';

function GoalsDailyProgress() {
  const date = useGoalsTrackingDailyStore((store) => store.date);
  const goals = useDailyGoals(date);

  const completedGoals = goals.filter(({ done }) => done).length;
  const totalGoals = goals.length;
  const progress = totalGoals === 0 ? 0 : (completedGoals / totalGoals) * 100;

  return (
    <Box sx={{ px: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

export default GoalsDailyProgress;
