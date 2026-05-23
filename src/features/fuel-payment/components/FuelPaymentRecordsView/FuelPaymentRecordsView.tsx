import { useFuelPaymentMonthlyRecords, useFuelPaymentMyGroupMembers, useOpenFuelPaymentRecordDialog } from '@/features/fuel-payment/hooks';
import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { useFuelPaymentMonthlyStore } from '@/features/fuel-payment/stores';
import { toKstDateKey } from '@/lib';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import FuelPaymentMonthPicker from './FuelPaymentMonthPicker';
import FuelPaymentRecordCalendar from './FuelPaymentRecordCalendar';

function FuelPaymentRecordsView() {
  const year = useFuelPaymentMonthlyStore((s) => s.year);
  const month = useFuelPaymentMonthlyStore((s) => s.month);

  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());
  const openDialog = useOpenFuelPaymentRecordDialog();
  const groupMembers = useFuelPaymentMyGroupMembers();
  const recordsThisMonth = useFuelPaymentMonthlyRecords();

  const handleCellClick = async (date: Date) => {
    const dateKey = toKstDateKey(date);
    const existing = myGroup?.records.find((r) => toKstDateKey(r.date) === dateKey);
    if (existing) {
      await openDialog({ type: 'edit', date: existing.date, userId: existing.userId });
    } else {
      await openDialog({ type: 'add', date });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 1, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <FuelPaymentMonthPicker />
      </Box>
      <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        <FuelPaymentRecordCalendar
          year={year}
          month={month}
          records={recordsThisMonth}
          groupMembers={groupMembers}
          onCellClick={handleCellClick}
        />
      </Box>
    </Box>
  );
}

export default FuelPaymentRecordsView;
