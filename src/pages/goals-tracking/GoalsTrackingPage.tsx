import { ToolLayout } from '@/components/ToolLayout';
import { GoalAdditionButton, GoalsTrackerViewTabs } from '@/features/goals-tracking/components';

function GoalsTrackingPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <GoalAdditionButton />
        </ToolLayout.Row>

        <GoalsTrackerViewTabs />
      </ToolLayout.Header>
    </ToolLayout>
  );
}

export default GoalsTrackingPage;
