import { ToolLayout } from '@/components/ToolLayout';
import GoalsDailyDatePicker from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsDailyDatePicker';
import GoalsDailyProgress from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsDailyProgress';
import GoalsDailyRecords from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsDailyRecords';
import GoalsDailyRecordsSkeleton from '@/features/goals-tracking/components/GoalsDailyRecordView/GoalsDailyRecordsSkeleton';
import { Suspense } from 'react';

function GoalsDailyRecordView() {
  return (
    <ToolLayout>
      <ToolLayout.Header sx={{ px: 1 }}>
        <GoalsDailyDatePicker />
        <GoalsDailyProgress />
      </ToolLayout.Header>
      <ToolLayout.Body>
        <Suspense fallback={<GoalsDailyRecordsSkeleton />}>
          <GoalsDailyRecords />
        </Suspense>
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default GoalsDailyRecordView;
