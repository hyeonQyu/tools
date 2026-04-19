import { pxToRem } from '@/styles';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Ref } from 'react';

interface NavigationPickerProps {
  label: string;
  subLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
  jumpButtonLabel?: string;
  onJump?: () => void;
  showJumpButton?: boolean;
  onLabelClick?: () => void;
  labelRef?: Ref<HTMLSpanElement>;
  children?: React.ReactNode;
}

function NavigationPicker({
  label,
  subLabel,
  onPrev,
  onNext,
  disableNext = false,
  jumpButtonLabel,
  onJump,
  showJumpButton = false,
  onLabelClick,
  labelRef,
  children,
}: NavigationPickerProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <IconButton onClick={onPrev}>
        <ArrowBackIosNew />
      </IconButton>

      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: onLabelClick ? 'pointer' : 'default' }}
          onClick={onLabelClick}
        >
          <Typography ref={labelRef} variant="h6">
            {label}
          </Typography>
          {subLabel && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              {subLabel}
            </Typography>
          )}
        </Box>
        {showJumpButton && jumpButtonLabel && onJump && (
          <Button
            size="small"
            onClick={onJump}
            variant="outlined"
            sx={{
              position: 'absolute',
              top: '50%',
              left: `calc(100% + ${pxToRem(12)})`,
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
              fontSize: '0.65rem',
              py: 0.25,
              px: 0.75,
              height: 'fit-content',
              minWidth: pxToRem(44),
            }}
          >
            {jumpButtonLabel}
          </Button>
        )}
        {children}
      </Box>

      <IconButton onClick={onNext} disabled={disableNext}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}

export default NavigationPicker;
