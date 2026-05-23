import { useOpenFuelPaymentMemberAdditionDialog, useOpenFuelPaymentRecordDialog } from '@/features/fuel-payment/hooks';
import { useFuelPaymentStore } from '@/features/fuel-payment/stores';
import { FuelPaymentViewType } from '@/features/fuel-payment/types';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function FuelPaymentAdditionButton() {
  const currentView = useFuelPaymentStore((store) => store.currentView);
  const openRecordDialog = useOpenFuelPaymentRecordDialog();
  const openMemberAdditionDialog = useOpenFuelPaymentMemberAdditionDialog();

  const clickHandlerByViewType: Record<FuelPaymentViewType, () => Promise<void>> = {
    records: () => openRecordDialog({ type: 'add' }),
    members: openMemberAdditionDialog,
  };

  return (
    <IconButton onClick={clickHandlerByViewType[currentView]}>
      <Add />
    </IconButton>
  );
}

export default FuelPaymentAdditionButton;
