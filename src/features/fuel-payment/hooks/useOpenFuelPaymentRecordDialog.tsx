import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { FuelPaymentRecordDialog, FuelPaymentRecordResult } from '@/features/fuel-payment/components/FuelPaymentRecordDialog';
import { fuelPaymentService } from '@/features/fuel-payment/data';
import { useFuelPaymentMyGroupMembers } from '@/features/fuel-payment/hooks/useFuelPaymentMyGroupMembers';
import { useRefreshMyGroupQuery } from '@/features/fuel-payment/hooks/useRefreshMyGroupQuery';
import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { enqueueClosableSnackbar } from '@/styles';
import { useQuery } from '@tanstack/react-query';

export type OpenFuelPaymentRecordDialogMode =
  | { type: 'add'; date?: Date }
  | { type: 'edit'; date: Date; userId: string; pricePerLiter?: number; totalAmount?: number };

export const useOpenFuelPaymentRecordDialog = () => {
  const dialog = useDialog();
  const refreshMyGroupQuery = useRefreshMyGroupQuery();

  const { data: myGroup, isFetched: isMyGroupFetched } = useQuery(getFuelPaymentMyGroupQueryOptions());
  const groupMembers = useFuelPaymentMyGroupMembers();

  return async (mode: OpenFuelPaymentRecordDialogMode) => {
    if (!isMyGroupFetched) return;

    const initialGroup = myGroup ?? (await fuelPaymentService.createGroup());
    await refreshMyGroupQuery(initialGroup.id);
    const group = (await fuelPaymentService.getMyGroup()) ?? initialGroup;

    const saveMemoIfChanged = async (result: FuelPaymentRecordResult) => {
      const nextMemo = result.memo ?? '';
      if (nextMemo === (group.memo ?? '')) return;
      await fuelPaymentService.updateMemo(group.id, nextMemo);
    };

    if (mode.type === 'add') {
      await dialog.open<FuelPaymentRecordResult>({
        title: '기록 추가',
        content: (close) => (
          <FuelPaymentRecordDialog
            groupMembers={groupMembers}
            defaultValues={{ date: mode.date, memo: group.memo }}
            close={close}
            confirmConfig={{
              label: '추가',
              onConfirm: async (result) => {
                await fuelPaymentService.addRecord(group.id, result);
                await saveMemoIfChanged(result);
                await refreshMyGroupQuery(group.id);
                enqueueClosableSnackbar({ message: '기록이 추가되었습니다.', variant: 'success' });
              },
            }}
          />
        ),
        fullScreen: true,
        slots: { transition: SlideUpTransition },
      });
      return;
    }

    const originalDate = mode.date;
    await dialog.open<FuelPaymentRecordResult>({
      title: '기록 수정',
      content: (close) => (
        <FuelPaymentRecordDialog
          groupMembers={groupMembers}
          defaultValues={{
            date: mode.date,
            userId: mode.userId,
            pricePerLiter: mode.pricePerLiter,
            totalAmount: mode.totalAmount,
            memo: group.memo,
          }}
          close={close}
          confirmConfig={{
            label: '수정',
            onConfirm: async (result) => {
              await fuelPaymentService.updateRecord(group.id, originalDate, result);
              await saveMemoIfChanged(result);
              await refreshMyGroupQuery(group.id);
              enqueueClosableSnackbar({ message: '기록이 수정되었습니다.', variant: 'success' });
            },
          }}
          onDelete={async () => {
            const confirmed = await dialog.confirm({
              title: '기록 삭제',
              content: '정말로 삭제하시겠습니까?',
            });
            if (!confirmed) return;
            await fuelPaymentService.removeRecord(group.id, originalDate);
            await refreshMyGroupQuery(group.id);
            enqueueClosableSnackbar({ message: '기록이 삭제되었습니다.', variant: 'success' });
            close();
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };
};
