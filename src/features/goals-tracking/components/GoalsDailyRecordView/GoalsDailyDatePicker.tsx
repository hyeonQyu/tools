import { dateFormat } from '@/date';
import { useGoalsTrackingDailyStore } from '@/features/goals-tracking/stores';
import { pxToRem } from '@/styles';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

function GoalsDailyDatePicker() {
  const { date, setDate } = useGoalsTrackingDailyStore();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const dayjsDate = dayjs(date);
  const dayjsToday = dayjs();
  const isToday = dayjsDate.isSame(dayjsToday, 'day');

  const handlePrevDay = () => setDate(dayjsDate.subtract(1, 'day').toDate());
  const handleNextDay = () => setDate(dayjsDate.add(1, 'day').toDate());
  const handleGoToday = () => setDate(dayjsToday.toDate());

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <IconButton onClick={handlePrevDay}>
        <ArrowBackIosNew />
      </IconButton>

      <Box sx={{ position: 'relative' }}>
        <Typography ref={anchorRef} onClick={() => setOpen(true)} variant="h6" sx={{ cursor: 'pointer', userSelect: 'none' }}>
          {dayjsDate.format(dateFormat)}
        </Typography>
        {!isToday && (
          <Button
            size="small"
            onClick={handleGoToday}
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
            오늘로
          </Button>
        )}
        <DatePicker
          open={open}
          onClose={() => setOpen(false)}
          value={dayjsDate}
          maxDate={dayjsToday}
          onChange={(newValue) => newValue && setDate(newValue.toDate())}
          slotProps={{
            textField: { sx: { display: 'none' } },
            popper: { anchorEl: anchorRef.current },
          }}
        />
      </Box>

      <IconButton onClick={handleNextDay} disabled={isToday}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}

export default GoalsDailyDatePicker;
