import { useOpenBelongingItemDialog } from '@/features/belongings/hooks';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function BelongingsAddButton() {
  const { openAdd } = useOpenBelongingItemDialog();

  return (
    <IconButton onClick={() => openAdd()}>
      <Add />
    </IconButton>
  );
}

export default BelongingsAddButton;
