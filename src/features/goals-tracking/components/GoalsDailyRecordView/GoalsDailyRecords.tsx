import GoalsSection from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsSection';
import { useDailyGoals, useToggleDailyGoalCompleted } from '@/features/goals-tracking/hooks';
import { useGoalsTrackingDailyStore } from '@/features/goals-tracking/stores';
import { Stack } from '@mui/material';

function GoalsDailyRecords() {
  const date = useGoalsTrackingDailyStore((store) => store.date);
  const goals = useDailyGoals(date);

  const handleToggleGoalCompleted = useToggleDailyGoalCompleted(date);

  const items = goals.map(({ goal, done }) => ({ id: goal.id, name: goal.name, checked: done }));
  const completedItems = items.filter((item) => item.checked);
  const incompleteItems = items.filter((item) => !item.checked);

  return (
    <Stack gap={1.6}>
      <GoalsSection title="전체" items={items} onToggleCompleted={handleToggleGoalCompleted} unfoldable />
      <GoalsSection title="완료" items={completedItems} onToggleCompleted={handleToggleGoalCompleted} />
      <GoalsSection title="미완료" items={incompleteItems} onToggleCompleted={handleToggleGoalCompleted} />
    </Stack>
  );
}

export default GoalsDailyRecords;
