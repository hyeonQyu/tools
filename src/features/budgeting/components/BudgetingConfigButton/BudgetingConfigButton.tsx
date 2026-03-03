import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { BudgetingConfigDialog } from '@/features/budgeting/components/BudgetingConfigDialog';
import { Settings } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function BudgetingConfigButton() {
  const dialog = useDialog();

  const handleClick = async () => {
    await dialog.open<void>({
      title: '분배 설정',
      content: (close) => <BudgetingConfigDialog close={close} />,
      fullScreen: true,
      slots: {
        transition: SlideUpTransition,
      },
    });
  };

  return (
    <IconButton onClick={handleClick}>
      <Settings />
    </IconButton>
  );
}

export default BudgetingConfigButton;
