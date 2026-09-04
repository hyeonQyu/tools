import { useExpirationDateStore } from '@/features/expiration-dates/stores';
import { ExpirationDateViewType } from '@/features/expiration-dates/types';
import { Tab, Tabs } from '@mui/material';

const tabs: Array<{ label: string; value: ExpirationDateViewType }> = [
  { label: '달력', value: 'calendar' },
  { label: '검색', value: 'search' },
];

function ExpirationDateViewTabs() {
  const currentView = useExpirationDateStore((s) => s.currentView);
  const setCurrentView = useExpirationDateStore((s) => s.setCurrentView);

  return (
    <Tabs variant="fullWidth" value={currentView} onChange={(_, value) => setCurrentView(value)}>
      {tabs.map(({ label, value }) => (
        <Tab key={value} value={value} label={label} sx={{ padding: 1 }} />
      ))}
    </Tabs>
  );
}

export default ExpirationDateViewTabs;
