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
        bgcolor: 'background.default',
        zIndex: 10,
        px: 3,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}

export default ToolLayoutHeader;
