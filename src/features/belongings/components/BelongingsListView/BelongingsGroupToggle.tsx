import { useDialog } from '@/dialog';
import { useBelongingStore } from '@/features/belongings/stores';
import { BelongingGroupByType } from '@/features/belongings/types';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

const OPTIONS: { value: BelongingGroupByType; label: string }[] = [
  { value: 'location', label: '위치별로 묶어보기' },
  { value: 'tag', label: '태그별로 묶어보기' },
];

function BelongingsGroupToggle() {
  const groupBy = useBelongingStore((s) => s.groupBy);
  const setGroupBy = useBelongingStore((s) => s.setGroupBy);
  const dialog = useDialog();

  const currentLabel = OPTIONS.find((o) => o.value === groupBy)?.label ?? '';

  const handleClick = async () => {
    await dialog.open({
      title: '목록 보기 옵션',
      maxWidth: 'xs',
      fullWidth: true,
      content: (close) => (
        <Box sx={{ pb: 2 }}>
          <List disablePadding>
            {OPTIONS.map((option) => (
              <ListItem key={option.value} disablePadding>
                <ListItemButton
                  selected={groupBy === option.value}
                  onClick={() => {
                    setGroupBy(option.value);
                    close();
                  }}
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={groupBy === option.value ? 700 : 400}>
                        {option.label}
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

export default BelongingsGroupToggle;
