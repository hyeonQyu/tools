import { FuelPaymentRecord } from '@/features/fuel-payment/data/repositories';
import { useFuelPaymentMyGroupMembers, useOpenFuelPaymentRecordDialog } from '@/features/fuel-payment/hooks';
import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { useFuelPaymentMonthlyStore } from '@/features/fuel-payment/stores';
import {
  filterFuelPaymentRecordsByMonth,
  getAdjacentFuelPaymentMonth,
  getFuelPaymentRecordByDateKey,
} from '@/features/fuel-payment/utils/fuelPaymentRecord.utils';
import { toKstDateKey } from '@/lib';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import FuelPaymentMonthPicker from './FuelPaymentMonthPicker';
import FuelPaymentRecordCalendar from './FuelPaymentRecordCalendar';
import { useFuelPaymentRecordSwipe } from './useFuelPaymentRecordSwipe';

const EMPTY_RECORDS: FuelPaymentRecord[] = [];

function FuelPaymentRecordsView() {
  const year = useFuelPaymentMonthlyStore((s) => s.year);
  const month = useFuelPaymentMonthlyStore((s) => s.month);
  const setYearMonth = useFuelPaymentMonthlyStore((s) => s.setYearMonth);

  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());
  const openDialog = useOpenFuelPaymentRecordDialog();
  const groupMembers = useFuelPaymentMyGroupMembers();
  const allRecords = myGroup?.records ?? EMPTY_RECORDS;

  const prevYearMonth = useMemo(() => getAdjacentFuelPaymentMonth({ year, month }, 'prev'), [year, month]);
  const nextYearMonth = useMemo(() => getAdjacentFuelPaymentMonth({ year, month }, 'next'), [year, month]);
  const recordByDateKey = useMemo(() => getFuelPaymentRecordByDateKey(allRecords), [allRecords]);

  const recordsThisMonth = useMemo(() => filterFuelPaymentRecordsByMonth(allRecords, { year, month }), [allRecords, year, month]);

  const recordsPrevMonth = useMemo(() => filterFuelPaymentRecordsByMonth(allRecords, prevYearMonth), [allRecords, prevYearMonth]);

  const recordsNextMonth = useMemo(() => filterFuelPaymentRecordsByMonth(allRecords, nextYearMonth), [allRecords, nextYearMonth]);

  const { containerRef, x, peekX, peekPanel, navigateAdjacent, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } =
    useFuelPaymentRecordSwipe({
      onNavigate: (direction) => {
        const target = getAdjacentFuelPaymentMonth({ year, month }, direction);
        setYearMonth(target.year, target.month);
      },
    });

  const handleCellClick = async (date: Date) => {
    const existing = recordByDateKey.get(toKstDateKey(date));
    if (existing) {
      await openDialog({
        type: 'edit',
        date: existing.date,
        userId: existing.userId,
        pricePerLiter: existing.pricePerLiter,
        totalAmount: existing.totalAmount,
      });
    } else {
      await openDialog({ type: 'add', date });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 1, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <FuelPaymentMonthPicker onPrev={() => navigateAdjacent('prev')} onNext={() => navigateAdjacent('next')} />
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
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              x: peekX,
              overflowY: 'auto',
              padding: '16px',
            }}
          >
            <FuelPaymentRecordCalendar
              year={peekPanel === 'prev' ? prevYearMonth.year : nextYearMonth.year}
              month={peekPanel === 'prev' ? prevYearMonth.month : nextYearMonth.month}
              records={peekPanel === 'prev' ? recordsPrevMonth : recordsNextMonth}
              groupMembers={groupMembers}
              onCellClick={handleCellClick}
            />
          </motion.div>
        )}

        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            x,
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          <FuelPaymentRecordCalendar
            year={year}
            month={month}
            records={recordsThisMonth}
            groupMembers={groupMembers}
            onCellClick={handleCellClick}
          />
        </motion.div>
      </Box>
    </Box>
  );
}

export default FuelPaymentRecordsView;
