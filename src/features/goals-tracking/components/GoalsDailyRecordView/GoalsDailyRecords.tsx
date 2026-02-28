import GoalsSection from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsSection';
import { getGoalsFindByDateQueryOptions } from '@/features/goals-tracking/queries/goals.query.findByDate';
import { useGoalsTrackingDailyStore } from '@/features/goals-tracking/stores';
import { Stack } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';

function GoalsDailyRecords() {
  const date = useGoalsTrackingDailyStore((store) => store.date);

  const {
    data: { goals },
  } = useSuspenseQuery(getGoalsFindByDateQueryOptions(date));

  const items = goals.map(({ goal, done }) => ({ name: goal.name, checked: done }));
  const completedItems = items.filter((item) => item.checked);
  const incompleteItems = items.filter((item) => !item.checked);

  return (
    <Stack gap={1.6}>
      <GoalsSection title="전체" items={items} />
      <GoalsSection title="완료" items={completedItems} unfoldable />
      <GoalsSection title="미완료" items={incompleteItems} unfoldable />
    </Stack>
  );
}

export default GoalsDailyRecords;
