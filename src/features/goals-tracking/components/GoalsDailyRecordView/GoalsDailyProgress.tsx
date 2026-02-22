import { Box, LinearProgress } from '@mui/material';

function GoalsDailyProgress() {
  return (
    <Box sx={{ px: 2 }}>
      <LinearProgress variant="determinate" value={50} />
    </Box>
  );
}

export default GoalsDailyProgress;
