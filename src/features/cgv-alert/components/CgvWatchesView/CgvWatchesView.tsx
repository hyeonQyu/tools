import { CgvPushPermissionCard } from '@/features/cgv-alert/components/CgvPushPermissionCard';
import { CgvWatchListItem } from '@/features/cgv-alert/components/CgvWatchListItem';
import { useCgvWatches } from '@/features/cgv-alert/hooks';
import { Box, List, Stack, Typography } from '@mui/material';

function CgvWatchesView() {
  const watches = useCgvWatches();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <CgvPushPermissionCard />
      </Stack>

      {watches.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 3, py: 6 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            등록된 감시 항목이 없습니다.
            <br />
            우측 상단 + 버튼으로 극장을 추가해 보세요.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {watches.map((watch) => (
            <CgvWatchListItem key={watch.id} watch={watch} />
          ))}
        </List>
      )}
    </Box>
  );
}

export default CgvWatchesView;
