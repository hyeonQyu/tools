import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import {
  FuelPaymentMemberAdditionDialog,
  FuelPaymentMemberAdditionResult,
} from '@/features/fuel-payment/components/FuelPaymentMemberAdditionDialog';
import { fuelPaymentService } from '@/features/fuel-payment/data';
import { useRefreshMyGroupQuery } from '@/features/fuel-payment/hooks';
import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { enqueueClosableSnackbar } from '@/styles';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

function FuelPaymentAdditionButton() {
  const dialog = useDialog();
  const refreshMyGroupQuery = useRefreshMyGroupQuery();

  const { data: myGroup, isFetched } = useQuery(getFuelPaymentMyGroupQueryOptions());

  const handleClick = async () => {
    if (!isFetched) return;

    const group = myGroup ?? (await fuelPaymentService.createGroup());
    await refreshMyGroupQuery();

    await dialog.open<FuelPaymentMemberAdditionResult>({
      title: '멤버 추가',
      content: (close) => (
        <FuelPaymentMemberAdditionDialog
          myGroup={group}
          filterUser={(user) => !group.userIds.includes(user.id)}
          close={close}
          onConfirm={async (userId, color) => {
            await fuelPaymentService.addMember(group.id, userId, color);
            await refreshMyGroupQuery(group.id);

            enqueueClosableSnackbar({
              message: '멤버가 추가되었습니다.',
              variant: 'success',
            });
          }}
        />
      ),
      fullScreen: true,
      slots: {
        transition: SlideUpTransition,
      },
    });
  };

  return (
    <IconButton onClick={handleClick}>
      <Add />
    </IconButton>
  );
}

export default FuelPaymentAdditionButton;
