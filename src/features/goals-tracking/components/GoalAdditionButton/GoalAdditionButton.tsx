import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { GoalInformationDialog, GoalResult } from '@/features/goals-tracking/components/GoalInformationDialog';
import { goalsTrackingService } from '@/features/goals-tracking/data';
import { enqueueClosableSnackbar } from '@/styles';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function GoalAdditionButton() {
  const dialog = useDialog();

  const handleClick = async () => {
    await dialog.open<GoalResult>({
      title: '새 목표 추가',
      content: (close) => (
        <GoalInformationDialog
          close={close}
          confirmConfig={{
            label: '생성',
            onConfirm: async (goal) => {
              await goalsTrackingService.create(goal);
              enqueueClosableSnackbar({
                message: '목표가 생성되었습니다.',
                variant: 'success',
              });
              close(goal);
            },
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

export default GoalAdditionButton;
