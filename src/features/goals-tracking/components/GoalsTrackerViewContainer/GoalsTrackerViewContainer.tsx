import { GoalsDailyRecordView } from '@/features/goals-tracking/components/GoalsDailyRecordView';
import { GoalsYearStatsView } from '@/features/goals-tracking/components/GoalsYearStatsView';
import { useGoalsTrackingStore } from '@/features/goals-tracking/stores';
import { GoalsTrackerViewType } from '@/features/goals-tracking/types';
import { SlideTabViews, SlideTabViewsItem } from '@/components/SlideTabViews';

const items: SlideTabViewsItem<GoalsTrackerViewType>[] = [
  { value: 'daily', children: <GoalsDailyRecordView /> },
  { value: 'yearly', children: <GoalsYearStatsView /> },
];

function GoalsTrackerViewContainer() {
  const currentView = useGoalsTrackingStore((s) => s.currentView);

  return <SlideTabViews currentValue={currentView} items={items} />;
}

export default GoalsTrackerViewContainer;
