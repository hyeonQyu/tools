import { useDaisoShoppingItems } from '@/features/daiso-shopping/hooks';
import { Box, Stack } from '@mui/material';
import { DaisoShoppingListView } from '../DaisoShoppingListView';
import { DaisoStoreSelectBar } from '../DaisoStoreSelectBar';

function DaisoShoppingBody() {
  useDaisoShoppingItems();

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <Box sx={{ px: 3, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <DaisoStoreSelectBar />
      </Box>

      <DaisoShoppingListView />
    </Stack>
  );
}

export default DaisoShoppingBody;
