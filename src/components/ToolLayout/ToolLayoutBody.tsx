import { Stack, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface ToolLayoutBodyProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

function ToolLayoutBody({ children, sx }: ToolLayoutBodyProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        px: 4,
        py: 2,
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}

export default ToolLayoutBody;
