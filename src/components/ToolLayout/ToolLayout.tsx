import ToolLayoutBody from '@/components/ToolLayout/ToolLayoutBody';
import ToolLayoutHeader from '@/components/ToolLayout/ToolLayoutHeader';
import ToolLayoutRow from '@/components/ToolLayout/ToolLayoutRow';
import ToolLayoutTitle from '@/components/ToolLayout/ToolLayoutTitle';
import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

function ToolLayout({ children, sx }: ToolLayoutProps) {
  return (
    <Box
      sx={{
        maxWidth: 900,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        mx: 'auto',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

ToolLayout.Header = ToolLayoutHeader;
ToolLayout.Row = ToolLayoutRow;
ToolLayout.Title = ToolLayoutTitle;
ToolLayout.Body = ToolLayoutBody;
export default ToolLayout;
