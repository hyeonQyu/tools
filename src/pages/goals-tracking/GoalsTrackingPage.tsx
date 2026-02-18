import { ToolLayout } from '@/components/ToolLayout';
import {
  GoalAdditionButton,
  GoalsTrackerViewContainer,
  GoalsTrackerViewTabs,
} from '@/features/goals-tracking/components';

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

      <GoalsTrackerViewContainer />
    </ToolLayout>
  );
}

export default GoalsTrackingPage;
