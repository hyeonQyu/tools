import { GoalsTrackerViewType } from '@/features/goals-tracking/types';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

const tabs: Array<{ label: string; value: GoalsTrackerViewType }> = [
  { label: '일별 기록', value: 'daily' },
  { label: '연도별 통계', value: 'yearly' },
];

function GoalsTrackerViewTabs() {
  const [currentValue, setCurrentValue] = useState<GoalsTrackerViewType>(tabs[0].value);

  return (
    <Tabs
      sx={{
        '&.MuiTabs-root': {
          mb: -2,
        },
      }}
      variant="fullWidth"
      value={currentValue}
      onChange={(_, value) => setCurrentValue(value)}
    >
      {tabs.map(({ label, value }) => (
        <Tab key={value} value={value} label={label} sx={{ padding: 1 }} />
      ))}
    </Tabs>
  );
}

export default GoalsTrackerViewTabs;
