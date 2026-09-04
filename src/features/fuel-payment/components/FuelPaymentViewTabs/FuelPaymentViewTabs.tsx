import { useFuelPaymentStore } from '@/features/fuel-payment/stores';
import { FuelPaymentViewType } from '@/features/fuel-payment/types';
import { Tab, Tabs } from '@mui/material';

const tabs: Array<{ label: string; value: FuelPaymentViewType }> = [
  { label: '기록 보기', value: 'records' },
  { label: '멤버 보기', value: 'members' },
];

function FuelPaymentViewTabs() {
  const currentView = useFuelPaymentStore((store) => store.currentView);
  const setCurrentView = useFuelPaymentStore((store) => store.setCurrentView);

  return (
    <Tabs variant="fullWidth" value={currentView} onChange={(_, value) => setCurrentView(value)}>
      {tabs.map(({ label, value }) => (
        <Tab key={value} value={value} label={label} sx={{ padding: 1 }} />
      ))}
    </Tabs>
  );
}

export default FuelPaymentViewTabs;
