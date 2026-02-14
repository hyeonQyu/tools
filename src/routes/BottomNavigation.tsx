'use client';

import { useBottomNavigation, useTypedNavigate } from '@/routes';
import { pxToRem, Z_INDEX } from '@/styles';
import { BottomNavigationAction, BottomNavigation as MUIBottomNavigation, Paper, useTheme } from '@mui/material';
import { ComponentType } from 'react';

export const BOTTOM_NAVIGATION_HEIGHT = 56;

function BottomNavigation() {
  const { spacing } = useTheme();
  const navigate = useTypedNavigate();

  const { navigationData, currentNavigationIndex } = useBottomNavigation();

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: Z_INDEX.bottomNavigation,
        height: pxToRem(BOTTOM_NAVIGATION_HEIGHT),
      }}
    >
      <MUIBottomNavigation showLabels value={currentNavigationIndex}>
        {navigationData.map(({ pathname, label, iconFilled, iconOutlined }, index) => {
          const isActive = currentNavigationIndex === index;
          const IconComponent = (isActive ? iconFilled : iconOutlined) as ComponentType | null;

          return (
            <BottomNavigationAction
              key={pathname}
              label={label}
              icon={IconComponent && <IconComponent />}
              onClick={() => navigate(pathname)}
              sx={{
                minWidth: spacing(8),
                padding: spacing(1, 2),
              }}
            />
          );
        })}
      </MUIBottomNavigation>
    </Paper>
  );
}

export default BottomNavigation;
