import { HappyWeekView, useHappyWeekStore } from '@/features/happy-week/stores';
import { Tab, Tabs } from '@mui/material';

const tabs: Array<{ label: string; value: HappyWeekView }> = [
  { label: '오늘', value: 'today' },
  { label: '14일', value: 'trip' },
];

/**
 * 도구 안의 탭은 딱 2개다. SlideTabViews는 children을 두 번 렌더하므로
 * 타이머가 도는 레일을 그 안에 넣지 않고, 값에 따라 조건부 렌더만 한다.
 */
function HappyWeekViewTabs() {
  const currentView = useHappyWeekStore((state) => state.currentView);
  const setCurrentView = useHappyWeekStore((state) => state.setCurrentView);

  return (
    <Tabs variant="fullWidth" value={currentView} onChange={(_, value: HappyWeekView) => setCurrentView(value)}>
      {tabs.map(({ label, value }) => (
        <Tab key={value} value={value} label={label} sx={{ padding: 1, minHeight: 40 }} />
      ))}
    </Tabs>
  );
}

export default HappyWeekViewTabs;
