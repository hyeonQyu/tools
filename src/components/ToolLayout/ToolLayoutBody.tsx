import { BOTTOM_NAVIGATION_CLEARANCE } from '@/routes';
import { pxToRem } from '@/styles';
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
        px: 3,
        pt: 1,
        pb: pxToRem(BOTTOM_NAVIGATION_CLEARANCE),
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
