import { Stack } from '@mui/material';
import { ReactNode } from 'react';

interface ToolLayoutBodyProps {
  children: ReactNode;
}

function ToolLayoutBody({ children }: ToolLayoutBodyProps) {
  return (
    <Stack spacing={2} sx={{ px: 4, py: 2, mb: 2 }}>
      {children}
    </Stack>
  );
}

export default ToolLayoutBody;
