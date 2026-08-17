import { useDialog } from '@/dialog';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoShoppingSortType } from '@/features/daiso-shopping/types';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

const OPTIONS: { value: DaisoShoppingSortType; label: string; description: string }[] = [
  { value: 'aisle', label: '진열 위치순', description: '매장에서 걸어다니는 순서(층 · 구역)대로 보기' },
  { value: 'added', label: '담은 순', description: '최근에 담은 물품부터 보기' },
  { value: 'stock', label: '재고 많은 순', description: '재고가 넉넉한 물품부터 보기' },
];

function DaisoShoppingSortToggle() {
  const sortBy = useDaisoShoppingStore((s) => s.sortBy);
  const setSortBy = useDaisoShoppingStore((s) => s.setSortBy);
  const dialog = useDialog();

  const currentLabel = OPTIONS.find((option) => option.value === sortBy)?.label ?? '';

  const handleClick = async () => {
    await dialog.open({
      title: '정렬 기준',
      maxWidth: 'xs',
      fullWidth: true,
      content: (close) => (
        <Box sx={{ pb: 2 }}>
          <List disablePadding>
            {OPTIONS.map((option) => (
              <ListItem key={option.value} disablePadding>
                <ListItemButton
                  selected={sortBy === option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    close();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={sortBy === option.value ? 700 : 400}>
                        {option.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ),
    });
  };

  return (
    <Button
      variant="outlined"
      size="small"
      endIcon={<ArrowDropDown />}
      onClick={handleClick}
      sx={{ textTransform: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
    >
      {currentLabel}
    </Button>
  );
}

export default DaisoShoppingSortToggle;
