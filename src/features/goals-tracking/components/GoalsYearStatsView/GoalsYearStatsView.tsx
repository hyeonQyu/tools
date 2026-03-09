import { ToolLayout } from '@/components/ToolLayout';
import GoalsYearlyYearPicker from '@/features/goals-tracking/components/GoalsYearStatsView/GoalsYearlyYearPicker';
import GoalsYearStats from '@/features/goals-tracking/components/GoalsYearStatsView/GoalsYearStats';
import GoalsYearStatsSkeleton from '@/features/goals-tracking/components/GoalsYearStatsView/GoalsYearStatsSkeleton';
import { Suspense } from 'react';

function GoalsYearStatsView() {
  return (
    <ToolLayout>
      <ToolLayout.Header sx={{ px: 1 }}>
        <GoalsYearlyYearPicker />
      </ToolLayout.Header>

      <ToolLayout.Body>
        <Suspense fallback={<GoalsYearStatsSkeleton />}>
          <GoalsYearStats />
        </Suspense>
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default GoalsYearStatsView;
