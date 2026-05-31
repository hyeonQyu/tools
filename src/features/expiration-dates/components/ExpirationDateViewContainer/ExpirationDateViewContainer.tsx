import { SlideTabViews, SlideTabViewsItem } from '@/components/SlideTabViews';
import { useExpirationDateStore } from '@/features/expiration-dates/stores';
import { ExpirationDateViewType } from '@/features/expiration-dates/types';
import { Box } from '@mui/material';
import { ExpirationDateCalendarView } from '../ExpirationDateCalendarView';
import { ExpirationDateSearchView } from '../ExpirationDateSearchView';

const items: SlideTabViewsItem<ExpirationDateViewType>[] = [
  { value: 'calendar', children: <ExpirationDateCalendarView /> },
  { value: 'search', children: <ExpirationDateSearchView /> },
];

function ExpirationDateViewContainer() {
  const currentView = useExpirationDateStore((s) => s.currentView);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <SlideTabViews currentValue={currentView} items={items} sx={{ height: '100%' }} />
    </Box>
  );
}

export default ExpirationDateViewContainer;
