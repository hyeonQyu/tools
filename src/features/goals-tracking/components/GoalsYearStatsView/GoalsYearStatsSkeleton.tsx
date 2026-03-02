import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

function GoalYearStatsCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Skeleton width={120} height={24} />
          <Skeleton variant="circular" width={28} height={28} />
        </Stack>

        <Stack direction="row" spacing={3} mb={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Stack key={i} alignItems="center" spacing={0.25}>
              <Skeleton width={40} height={28} />
              <Skeleton width={52} height={16} />
            </Stack>
          ))}
        </Stack>

        <Box sx={{ overflowX: 'hidden' }}>
          <Skeleton variant="rectangular" width="100%" height={92} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

function GoalsYearStatsSkeleton() {
  return (
    <Stack gap={1.6}>
      {Array.from({ length: 3 }).map((_, i) => (
        <GoalYearStatsCardSkeleton key={i} />
      ))}
    </Stack>
  );
}

export default GoalsYearStatsSkeleton;
