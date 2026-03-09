import { SlideTabViews, SlideTabViewsItem } from '@/components/SlideTabViews';
import { GoalsDailyRecordView } from '@/features/goals-tracking/components/GoalsDailyRecordView';
import { GoalsYearStatsView } from '@/features/goals-tracking/components/GoalsYearStatsView';
import { useGoalsTrackingStore } from '@/features/goals-tracking/stores';
import { GoalsTrackerViewType } from '@/features/goals-tracking/types';
import { Box } from '@mui/material';

const items: SlideTabViewsItem<GoalsTrackerViewType>[] = [
  { value: 'daily', children: <GoalsDailyRecordView /> },
  { value: 'yearly', children: <GoalsYearStatsView /> },
];

function GoalsTrackerViewContainer() {
  const currentView = useGoalsTrackingStore((s) => s.currentView);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <SlideTabViews currentValue={currentView} items={items} sx={{ height: '100%' }} />
    </Box>
  );
}

export default GoalsTrackerViewContainer;
