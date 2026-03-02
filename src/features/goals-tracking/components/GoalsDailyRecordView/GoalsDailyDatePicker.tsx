import { dateFormat } from '@/date';
import NavigationPicker from '@/features/goals-tracking/components/shared/NavigationPicker';
import { useGoalsTrackingDailyStore } from '@/features/goals-tracking/stores';
import { getKstNow, toKstDateKey } from '@/lib';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

function GoalsDailyDatePicker() {
  const { date, setDate } = useGoalsTrackingDailyStore();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const dayjsDate = dayjs(date);
  const today = getKstNow();
  const dayjsToday = dayjs(today);
  const isToday = toKstDateKey(date) === toKstDateKey(today);

  const handlePrevDay = () => setDate(dayjsDate.subtract(1, 'day').toDate());
  const handleNextDay = () => setDate(dayjsDate.add(1, 'day').toDate());
  const handleGoToday = () => setDate(dayjsToday.toDate());

  return (
    <NavigationPicker
      label={dayjsDate.format(dateFormat)}
      onPrev={handlePrevDay}
      onNext={handleNextDay}
      disableNext={isToday}
      jumpButtonLabel="오늘로"
      onJump={handleGoToday}
      showJumpButton={!isToday}
      onLabelClick={() => setOpen(true)}
      labelRef={anchorRef}
    >
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
    </NavigationPicker>
  );
}

export default GoalsDailyDatePicker;
