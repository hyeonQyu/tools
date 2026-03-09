import { Stack, Typography } from '@mui/material';

interface StatItemProps {
  label: string;
  value: string;
}

function GoalStatItem({ label, value }: StatItemProps) {
  return (
    <Stack alignItems="center" spacing={0.25}>
      <Typography variant="body1" fontWeight={700} lineHeight={1.2}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}

export default GoalStatItem;
