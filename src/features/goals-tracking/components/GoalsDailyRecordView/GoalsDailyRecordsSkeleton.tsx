import { Box, List, ListItem, ListItemIcon, Skeleton, Stack } from '@mui/material';

function GoalsSectionSkeleton({ rows }: { rows: number }) {
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ px: 2, py: 0.5 }}>
        <Skeleton variant="text" width={60} height={20} />
      </Box>
      <List dense>
        {Array.from({ length: rows }).map((_, index) => (
          <ListItem key={index} disablePadding sx={{ px: 1 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Skeleton variant="rounded" width={24} height={24} sx={{ borderRadius: 0.5 }} />
            </ListItemIcon>
            <Skeleton variant="text" width={`${55 + (index % 3) * 15}%`} height={20} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function GoalsDailyRecordsSkeleton() {
  return (
    <Stack gap={1.6}>
      <GoalsSectionSkeleton rows={4} />
      <GoalsSectionSkeleton rows={2} />
      <GoalsSectionSkeleton rows={2} />
    </Stack>
  );
}

export default GoalsDailyRecordsSkeleton;
