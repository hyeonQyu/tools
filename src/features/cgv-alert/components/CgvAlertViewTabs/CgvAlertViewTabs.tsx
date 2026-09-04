import { useCgvAlertStore } from '@/features/cgv-alert/stores';
import { CgvAlertViewType } from '@/features/cgv-alert/types';
import { Tab, Tabs } from '@mui/material';

const tabs: Array<{ label: string; value: CgvAlertViewType }> = [
  { label: '감시 목록', value: 'watches' },
  { label: '알림 이력', value: 'history' },
];

function CgvAlertViewTabs() {
  const currentView = useCgvAlertStore((store) => store.currentView);
  const setCurrentView = useCgvAlertStore((store) => store.setCurrentView);

  return (
    <Tabs variant="fullWidth" value={currentView} onChange={(_, value) => setCurrentView(value)}>
      {tabs.map(({ label, value }) => (
        <Tab key={value} value={value} label={label} sx={{ padding: 1 }} />
      ))}
    </Tabs>
  );
}

export default CgvAlertViewTabs;
