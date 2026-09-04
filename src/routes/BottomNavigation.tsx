'use client';

import { useBottomNavigation, useTypedNavigate } from '@/routes';
import { BOTTOM_NAVIGATION_HEIGHT, BOTTOM_NAVIGATION_OFFSET, CAPSULE_RADIUS, pxToRem, Z_INDEX } from '@/styles';
import { Box, ButtonBase, useTheme } from '@mui/material';
import { ComponentType } from 'react';

export { BOTTOM_NAVIGATION_CLEARANCE, BOTTOM_NAVIGATION_HEIGHT, BOTTOM_NAVIGATION_OFFSET } from '@/styles';

function BottomNavigation() {
  const { glass } = useTheme();
  const navigate = useTypedNavigate();

  const { navigationData, currentNavigationIndex } = useBottomNavigation();

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        left: '50%',
        bottom: pxToRem(BOTTOM_NAVIGATION_OFFSET),
        transform: 'translateX(-50%)',
        width: `min(calc(100% - ${pxToRem(48)}), ${pxToRem(360)})`,
        height: pxToRem(BOTTOM_NAVIGATION_HEIGHT),
        zIndex: Z_INDEX.bottomNavigation,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        p: pxToRem(6),
        borderRadius: CAPSULE_RADIUS,
        backgroundColor: glass.sheetBackground,
        border: `1px solid ${glass.sheetBorder}`,
        boxShadow: glass.sheetShadow,
        backdropFilter: glass.sheetBlur,
        WebkitBackdropFilter: glass.sheetBlur,
      }}
    >
      {navigationData.map(({ pathname, label, iconFilled, iconOutlined }, index) => {
        const isActive = currentNavigationIndex === index;
        const IconComponent = (isActive ? iconFilled : iconOutlined) as ComponentType | null;

        return (
          <ButtonBase
            key={pathname}
            onClick={() => navigate(pathname)}
            sx={{
              height: '100%',
              px: 2.75,
              gap: 1,
              borderRadius: CAPSULE_RADIUS,
              fontSize: pxToRem(13),
              fontWeight: 500,
              color: isActive ? 'accent.main' : 'text.secondary',
              backgroundColor: isActive ? glass.activePill : 'transparent',
              boxShadow: isActive ? glass.activePillShadow : 'none',
              transition: 'all 0.2s ease',
              '& svg': {
                fontSize: pxToRem(22),
              },
            }}
          >
            {IconComponent && <IconComponent />}
            <span>{label}</span>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default BottomNavigation;
