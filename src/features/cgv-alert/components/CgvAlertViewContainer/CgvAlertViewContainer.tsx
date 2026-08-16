import { SlideTabViews, SlideTabViewsItem } from '@/components/SlideTabViews';
import { CgvNotificationHistoryView } from '@/features/cgv-alert/components/CgvNotificationHistoryView';
import { CgvWatchesView } from '@/features/cgv-alert/components/CgvWatchesView';
import { useCgvAlertStore } from '@/features/cgv-alert/stores';
import { CgvAlertViewType } from '@/features/cgv-alert/types';
import { Box, Skeleton, Stack } from '@mui/material';
import { Suspense } from 'react';

const fallback = (
  <Stack spacing={1} sx={{ p: 2 }}>
    {[0, 1, 2].map((key) => (
      <Skeleton key={key} variant="rounded" height={64} />
    ))}
  </Stack>
);

const items: SlideTabViewsItem<CgvAlertViewType>[] = [
  { value: 'watches', children: <Suspense fallback={fallback}>{<CgvWatchesView />}</Suspense> },
  { value: 'history', children: <Suspense fallback={fallback}>{<CgvNotificationHistoryView />}</Suspense> },
];

function CgvAlertViewContainer() {
  const currentView = useCgvAlertStore((store) => store.currentView);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <SlideTabViews currentValue={currentView} items={items} sx={{ height: '100%' }} />
    </Box>
  );
}

export default CgvAlertViewContainer;
