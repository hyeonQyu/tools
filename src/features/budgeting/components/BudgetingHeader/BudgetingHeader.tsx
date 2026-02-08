import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { BudgetingConfigDialog } from '@/features/budgeting/components';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';

function BudgetingHeader() {
  const dialog = useDialog();

  const handleOpenConfigDialog = async () => {
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
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h5" fontWeight={600} sx={{ m: 0 }}>
        월급 분배
      </Typography>
      <IconButton onClick={handleOpenConfigDialog}>
        <SettingsIcon />
      </IconButton>
    </Stack>
  );
}

export default BudgetingHeader;
