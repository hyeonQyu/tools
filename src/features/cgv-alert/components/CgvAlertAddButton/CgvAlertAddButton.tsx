import { useOpenCgvWatchDialog } from '@/features/cgv-alert/hooks';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function CgvAlertAddButton() {
  const { openAdd } = useOpenCgvWatchDialog();

  return (
    <IconButton onClick={() => openAdd()}>
      <Add />
    </IconButton>
  );
}

export default CgvAlertAddButton;
