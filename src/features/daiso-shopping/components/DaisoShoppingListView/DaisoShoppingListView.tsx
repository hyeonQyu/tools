import {
  useDaisoShoppingItemActions,
  useDaisoStoreBoard,
  useOpenDaisoItemDetailDialog,
  useOpenDaisoProductSearchDialog,
} from '@/features/daiso-shopping/hooks';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { getDaisoShoppingGroups } from '@/features/daiso-shopping/utils';
import { Add } from '@mui/icons-material';
import { Alert, Box, Button, Divider, List, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import DaisoShoppingListItem from './DaisoShoppingListItem';
import DaisoShoppingSortToggle from './DaisoShoppingSortToggle';

function DaisoShoppingListView() {
  const items = useDaisoShoppingStore((s) => s.items);
  const sortBy = useDaisoShoppingStore((s) => s.sortBy);
  const { store, statuses, errorCount } = useDaisoStoreBoard();
  const { toggleDone, clearDone } = useDaisoShoppingItemActions();
  const openDetail = useOpenDaisoItemDetailDialog();
  const openProductSearch = useOpenDaisoProductSearchDialog();

  const groups = useMemo(() => getDaisoShoppingGroups(statuses, sortBy, store !== null), [statuses, sortBy, store]);

  const doneCount = items.filter((item) => item.done).length;
  const isAllFailed = errorCount > 0 && errorCount === items.length;

  if (items.length === 0) {
    return (
      <Stack sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 2, px: 3 }}>
        <Typography variant="body2" color="text.secondary">
          담아둔 물품이 없습니다.
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openProductSearch}>
          상품 검색해서 담기
        </Button>
      </Stack>
    );
  }

  return (
    <Stack sx={{ height: '100%', minHeight: 0 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}
      >
        <Typography variant="caption" color="text.secondary">
          {items.length}개 · 담음 {doneCount}개
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {doneCount > 0 && (
            <Button size="small" color="inherit" onClick={clearDone} sx={{ whiteSpace: 'nowrap' }}>
              담은 항목 비우기
            </Button>
          )}
          <DaisoShoppingSortToggle />
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {!store && (
          <Alert severity="info" variant="outlined" sx={{ m: 2 }}>
            매장을 선택하면 재고 수량과 진열 위치를 함께 볼 수 있어요.
          </Alert>
        )}

        {isAllFailed && (
          <Alert severity="warning" variant="outlined" sx={{ m: 2 }}>
            다이소 재고 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </Alert>
        )}

        {groups.map((group) => (
          <Box key={group.key}>
            {group.label && (
              <>
                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover', position: 'sticky', top: 0, zIndex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {group.label} ({group.statuses.length})
                  </Typography>
                </Box>
                <Divider />
              </>
            )}

            <List disablePadding>
              {group.statuses.map((status) => (
                <DaisoShoppingListItem
                  key={`${group.key}-${status.item.id}`}
                  status={status}
                  hasSelectedStore={store !== null}
                  onOpenDetail={() => openDetail(status.item.id)}
                  onToggleDone={() => toggleDone(status.item)}
                />
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

export default DaisoShoppingListView;
