import { Box, LinearProgress } from '@mui/material';

function GoalsDailyProgressFallback() {
  return (
    <Box sx={{ px: 2 }}>
      <LinearProgress />
    </Box>
  );
}

export default GoalsDailyProgressFallback;
