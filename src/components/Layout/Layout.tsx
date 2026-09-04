import { BottomNavigation } from '@/routes';
import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode | ReactNode[];
}

function Layout({ children }: LayoutProps) {
  const { glass } = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 페이지 바탕: 저채도 색 번짐. 탭바와 유리 시트가 이 위에 뜬다. */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundColor: glass.pageBackground,
          backgroundImage: glass.pageBackgroundImage,
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Box sx={{ flex: 1, overflow: 'auto', height: '100%', maxHeight: '100%' }}>{children}</Box>
      <BottomNavigation />
    </Box>
  );
}

export default Layout;
