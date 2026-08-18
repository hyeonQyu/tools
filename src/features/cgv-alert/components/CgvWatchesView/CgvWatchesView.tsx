import { CgvPushPermissionCard } from '@/features/cgv-alert/components/CgvPushPermissionCard';
import { CgvWatchAlertCard } from '@/features/cgv-alert/components/CgvWatchAlertCard';
import { CgvWatchListItem } from '@/features/cgv-alert/components/CgvWatchListItem';
import { useCgvWatches } from '@/features/cgv-alert/hooks';
import { usePushNotification } from '@/features/push';
import { Box, List, Stack, Typography } from '@mui/material';

function CgvWatchesView() {
  const watches = useCgvWatches();
  // 두 카드가 각자 호출하면 포그라운드 알림 스낵바가 두 번 뜨고 권한 상태도 서로 어긋난다. 여기서 한 번만 만든다.
  const push = usePushNotification();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <CgvPushPermissionCard push={push} />
        <CgvWatchAlertCard push={push} />
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
