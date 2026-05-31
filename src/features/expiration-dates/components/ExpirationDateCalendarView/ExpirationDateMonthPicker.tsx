import { useExpirationDateMonthlyStore } from '@/features/expiration-dates/stores';
import { getAdjacentExpirationMonth } from '@/features/expiration-dates/utils';
import NavigationPicker from '@/features/goals-tracking/components/shared/NavigationPicker';
import { getKstDateParts, getKstNow } from '@/lib';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

interface Props {
  onPrev?: () => void;
  onNext?: () => void;
}

function ExpirationDateMonthPicker({ onPrev, onNext }: Props) {
  const { year, month, setYearMonth, jumpToCurrent } = useExpirationDateMonthlyStore();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const current = getKstDateParts(getKstNow());
  const isCurrent = year === current.year && month === current.month;

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
      return;
    }
    const t = getAdjacentExpirationMonth({ year, month }, 'prev');
    setYearMonth(t.year, t.month);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }
    const t = getAdjacentExpirationMonth({ year, month }, 'next');
    setYearMonth(t.year, t.month);
  };

  return (
    <NavigationPicker
      label={`${year}년 ${month + 1}월`}
      onPrev={handlePrev}
      onNext={handleNext}
      jumpButtonLabel="이번달로"
      onJump={jumpToCurrent}
      showJumpButton={!isCurrent}
      onLabelClick={() => setOpen(true)}
      labelRef={anchorRef}
    >
      <DatePicker
        open={open}
        onClose={() => setOpen(false)}
        value={dayjs(new Date(year, month, 1))}
        views={['year', 'month']}
        openTo="month"
        onChange={(value) => {
          if (!value) return;
          setYearMonth(value.year(), value.month());
          setOpen(false);
        }}
        slotProps={{
          textField: { sx: { display: 'none' } },
          popper: { anchorEl: anchorRef.current },
        }}
      />
    </NavigationPicker>
  );
}

export default ExpirationDateMonthPicker;
