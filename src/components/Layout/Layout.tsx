import { BOTTOM_NAVIGATION_HEIGHT, BottomNavigation } from '@/routes';
import { pxToRem } from '@/styles';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode | ReactNode[];
}

function Layout({ children }: LayoutProps) {
  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${pxToRem(BOTTOM_NAVIGATION_HEIGHT)})`,
        height: `calc(100vh - ${pxToRem(BOTTOM_NAVIGATION_HEIGHT)})`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: 1, overflow: 'auto', height: '100%', maxHeight: '100%' }}>{children}</Box>
      <BottomNavigation />
    </Box>
  );
}

export default Layout;
