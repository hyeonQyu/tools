import { ToolLayout } from '@/components/ToolLayout';
import GoalsDailyDatePicker from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsDailyDatePicker';
import GoalsDailyProgress from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsDailyProgress';
import GoalsSection from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsSection';
import { Stack } from '@mui/material';

const DUMMY_ITEMS = [
  { name: '운동하기', checked: true },
  { name: '독서하기', checked: false },
];

const completedItems = DUMMY_ITEMS.filter((item) => item.checked);
const incompleteItems = DUMMY_ITEMS.filter((item) => !item.checked);

function GoalsDailyRecordView() {
  return (
    <ToolLayout>
      <ToolLayout.Header sx={{ px: 1 }}>
        <GoalsDailyDatePicker />
        <GoalsDailyProgress />
      </ToolLayout.Header>
      <ToolLayout.Body>
        <Stack gap={1.6}>
          <GoalsSection title="전체" items={DUMMY_ITEMS} />
          <GoalsSection title="완료" items={completedItems} unfoldable />
          <GoalsSection title="미완료" items={incompleteItems} unfoldable />
        </Stack>
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default GoalsDailyRecordView;
