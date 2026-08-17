import { useDaisoStoreBoard, useOpenDaisoStoreSelectDialog } from '@/features/daiso-shopping/hooks';
import { formatRelativeTimeFromNow } from '@/features/daiso-shopping/utils';
import { ExpandMore, Refresh, Storefront } from '@mui/icons-material';
import { Button, Chip, IconButton, Stack, Typography } from '@mui/material';

function DaisoStoreSelectBar() {
  const { store, isFetching, lastUpdatedAt, refetchAll } = useDaisoStoreBoard();
  const openStoreSelect = useOpenDaisoStoreSelectDialog();

  if (!store) {
    return (
      <Button variant="outlined" fullWidth startIcon={<Storefront />} onClick={openStoreSelect} sx={{ justifyContent: 'flex-start' }}>
        매장을 선택하세요
      </Button>
    );
  }

  return (
    <Stack spacing={0.25}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          icon={<Storefront />}
          label={store.storeName}
          onClick={openStoreSelect}
          onDelete={openStoreSelect}
          deleteIcon={<ExpandMore />}
          sx={{ fontWeight: 600, maxWidth: '100%' }}
        />

        <IconButton size="small" onClick={refetchAll} disabled={isFetching} aria-label="재고 새로고침">
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
        {isFetching ? '재고 확인 중…' : lastUpdatedAt ? `재고 확인 · ${formatRelativeTimeFromNow(lastUpdatedAt)}` : store.address}
      </Typography>
    </Stack>
  );
}

export default DaisoStoreSelectBar;
