import { useOpenDaisoProductSearchDialog } from '@/features/daiso-shopping/hooks';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function DaisoShoppingAddButton() {
  const openProductSearch = useOpenDaisoProductSearchDialog();

  return (
    <IconButton onClick={() => openProductSearch()}>
      <Add />
    </IconButton>
  );
}

export default DaisoShoppingAddButton;
