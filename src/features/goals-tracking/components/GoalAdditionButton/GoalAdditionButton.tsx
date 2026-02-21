import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { GoalInformationDialog } from '@/features/goals-tracking/components/GoalInformationDialog';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function GoalAdditionButton() {
  const dialog = useDialog();

  const handleClick = async () => {
    await dialog.open<void>({
      title: '새 목표 추가',
      content: (close) => <GoalInformationDialog close={close} />,
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
