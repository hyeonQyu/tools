import { Stack, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface ToolLayoutHeaderProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

function ToolLayoutHeader({ children, sx }: ToolLayoutHeaderProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        px: 3,
        pt: 3,
        pb: 2,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}

export default ToolLayoutHeader;
