import { SlideTabViews, SlideTabViewsItem } from '@/components/SlideTabViews';
import { FuelPaymentMembersView } from '@/features/fuel-payment/components/FuelPaymentMembersView';
import { FuelPaymentRecordsView } from '@/features/fuel-payment/components/FuelPaymentRecordsView';
import { useFuelPaymentStore } from '@/features/fuel-payment/stores';
import { FuelPaymentViewType } from '@/features/fuel-payment/types';
import { Box } from '@mui/material';

const items: SlideTabViewsItem<FuelPaymentViewType>[] = [
  { value: 'records', children: <FuelPaymentRecordsView /> },
  { value: 'members', children: <FuelPaymentMembersView /> },
];

function FuelPaymentViewContainer() {
  const currentView = useFuelPaymentStore((store) => store.currentView);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <SlideTabViews currentValue={currentView} items={items} sx={{ height: '100%' }} />
    </Box>
  );
}

export default FuelPaymentViewContainer;
