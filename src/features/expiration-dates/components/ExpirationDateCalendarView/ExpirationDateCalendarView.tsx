import { useExpirationDateSwipe, useOpenExpirationDateDayItemsDialog } from '@/features/expiration-dates/hooks';
import { useExpirationDateMonthlyStore, useExpirationDateStore } from '@/features/expiration-dates/stores';
import { filterExpirationItemsByMonth, getAdjacentExpirationMonth } from '@/features/expiration-dates/utils';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import ExpirationDateCalendar from './ExpirationDateCalendar';
import ExpirationDateMonthPicker from './ExpirationDateMonthPicker';

function ExpirationDateCalendarView() {
  const year = useExpirationDateMonthlyStore((s) => s.year);
  const month = useExpirationDateMonthlyStore((s) => s.month);
  const setYearMonth = useExpirationDateMonthlyStore((s) => s.setYearMonth);
  const items = useExpirationDateStore((s) => s.items);
  const openDayDialog = useOpenExpirationDateDayItemsDialog();

  const prevYM = useMemo(() => getAdjacentExpirationMonth({ year, month }, 'prev'), [year, month]);
  const nextYM = useMemo(() => getAdjacentExpirationMonth({ year, month }, 'next'), [year, month]);

  const itemsThisMonth = useMemo(() => filterExpirationItemsByMonth(items, { year, month }), [items, year, month]);
  const itemsPrevMonth = useMemo(() => filterExpirationItemsByMonth(items, prevYM), [items, prevYM]);
  const itemsNextMonth = useMemo(() => filterExpirationItemsByMonth(items, nextYM), [items, nextYM]);

  const { containerRef, x, peekX, peekPanel, navigateAdjacent, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } =
    useExpirationDateSwipe({
      onNavigate: (direction) => {
        const target = getAdjacentExpirationMonth({ year, month }, direction);
        setYearMonth(target.year, target.month);
      },
    });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 1, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <ExpirationDateMonthPicker onPrev={() => navigateAdjacent('prev')} onNext={() => navigateAdjacent('next')} />
      </Box>

      <Box
        ref={containerRef}
        sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {peekPanel && (
          <motion.div style={{ position: 'absolute', inset: 0, x: peekX, overflowY: 'auto', padding: '16px' }}>
            <ExpirationDateCalendar
              year={peekPanel === 'prev' ? prevYM.year : nextYM.year}
              month={peekPanel === 'prev' ? prevYM.month : nextYM.month}
              items={peekPanel === 'prev' ? itemsPrevMonth : itemsNextMonth}
              onCellClick={openDayDialog}
            />
          </motion.div>
        )}

        <motion.div style={{ position: 'absolute', inset: 0, x, overflowY: 'auto', padding: '16px' }}>
          <ExpirationDateCalendar year={year} month={month} items={itemsThisMonth} onCellClick={openDayDialog} />
        </motion.div>
      </Box>
    </Box>
  );
}

export default ExpirationDateCalendarView;
