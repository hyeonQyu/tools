import { useOpenExpirationDateItemDialog } from '@/features/expiration-dates/hooks';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function ExpirationDateAddButton() {
  const { openAdd } = useOpenExpirationDateItemDialog();

  return (
    <IconButton onClick={() => openAdd()}>
      <Add />
    </IconButton>
  );
}

export default ExpirationDateAddButton;
