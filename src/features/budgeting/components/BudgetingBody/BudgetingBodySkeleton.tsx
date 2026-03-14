import { Box, Card, IconButton, Skeleton, Stack } from '@mui/material';

function TotalAmountInputSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width={50} height={20} sx={{ mb: 1 }} />
      <Stack direction="row" spacing={1} alignItems="center">
        <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
      </Stack>
      <Skeleton variant="text" width={80} height={20} sx={{ mt: 0.5 }} />
    </Box>
  );
}

function AllocationTypeSelectorSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width={60} height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" width="100%" height={36} />
    </Box>
  );
}

function BudgetItemSkeleton() {
  return (
    <Card sx={{ p: 1.5, mb: 2 }}>
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="rectangular" width={24} height={24} sx={{ flexShrink: 0 }} />
          <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
          <IconButton size="small" disabled sx={{ flexShrink: 0 }}>
            <Skeleton variant="circular" width={24} height={24} />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={90} height={20} />
        </Stack>
      </Stack>
    </Card>
  );
}

function BudgetingBodySkeleton() {
  return (
    <Stack spacing={2}>
      <TotalAmountInputSkeleton />
      <AllocationTypeSelectorSkeleton />
      <Stack spacing={1}>
        {Array.from({ length: 3 }).map((_, i) => (
          <BudgetItemSkeleton key={i} />
        ))}
        <Skeleton variant="rounded" width="100%" height={36} />
      </Stack>
    </Stack>
  );
}

export default BudgetingBodySkeleton;
