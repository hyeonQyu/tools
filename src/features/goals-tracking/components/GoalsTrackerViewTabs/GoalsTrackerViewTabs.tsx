import { useGoalsTrackingStore } from '@/features/goals-tracking/stores';
import { GoalsTrackerViewType } from '@/features/goals-tracking/types';
import { Tab, Tabs } from '@mui/material';

const tabs: Array<{ label: string; value: GoalsTrackerViewType }> = [
  { label: '일별 기록', value: 'daily' },
  { label: '연도별 통계', value: 'yearly' },
];

function GoalsTrackerViewTabs() {
  const currentView = useGoalsTrackingStore((s) => s.currentView);
  const setCurrentView = useGoalsTrackingStore((s) => s.setCurrentView);

  return (
    <Tabs
      sx={{
        '&.MuiTabs-root': {
          mb: -2,
        },
      }}
      variant="fullWidth"
      value={currentView}
      onChange={(_, value) => setCurrentView(value)}
    >
      {tabs.map(({ label, value }) => (
        <Tab key={value} value={value} label={label} sx={{ padding: 1 }} />
      ))}
    </Tabs>
  );
}

export default GoalsTrackerViewTabs;
