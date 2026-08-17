import { useDialog } from '@/dialog';
import { useDaisoSelectedStore, useDaisoStoreActions, useDaisoStoreSearch } from '@/features/daiso-shopping/hooks';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoStoreStock } from '@/features/daiso-shopping/types';
import { formatDaisoDistance } from '@/features/daiso-shopping/utils';
import { useAutoTimeoutFocus } from '@/hooks/useAutoTimeoutFocus';
import { DeleteOutline, Search, Storefront } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef } from 'react';

export interface DaisoStoreSelectDialogProps {
  close: () => void;
}

function DaisoStoreSelectDialog({ close }: DaisoStoreSelectDialogProps) {
  const savedStores = useDaisoShoppingStore((s) => s.settings.stores);
  const selectedStore = useDaisoSelectedStore();
  const { save, select, remove } = useDaisoStoreActions();
  const { keyword, setKeyword, stores, isFetching, isError, isSearched } = useDaisoStoreSearch();
  const dialog = useDialog();

  const inputRef = useRef<HTMLInputElement>(null);
  useAutoTimeoutFocus(inputRef);

  const savedStoreCodes = new Set(savedStores.map((store) => store.storeCode));

  const handleSelect = async (storeCode: string) => {
    await select(storeCode);
    close();
  };

  const handleSave = async (store: DaisoStoreStock) => {
    await save(store);
    close();
  };

  const handleRemove = async (storeCode: string, storeName: string) => {
    const confirmed = await dialog.confirm({ title: '매장 삭제', content: `${storeName}을(를) 목록에서 삭제할까요?` });
    if (!confirmed) return;
    await remove(storeCode);
  };

  return (
    <Stack sx={{ height: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {savedStores.length > 0 && (
          <>
            <Box sx={{ px: 3, py: 1, bgcolor: 'action.hover' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                내 매장
              </Typography>
            </Box>

            <List disablePadding>
              {savedStores.map((store) => (
                <ListItem
                  key={store.storeCode}
                  disablePadding
                  divider
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemove(store.storeCode, store.storeName)} aria-label="매장 삭제">
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => handleSelect(store.storeCode)} sx={{ pr: 6 }}>
                    <Radio checked={selectedStore?.storeCode === store.storeCode} size="small" sx={{ p: 0.5, mr: 1 }} />
                    <ListItemText
                      primary={<Typography variant="body2">{store.storeName}</Typography>}
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                          {store.address}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider />
          </>
        )}

        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <TextField
            inputRef={inputRef}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 강남역점, 안산, 기흥구"
            helperText="지역명이나 매장명으로 검색하세요."
            size="small"
            fullWidth
            slotProps={{
              input: {
                inputMode: 'search',
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: isFetching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        </Box>

        {isError && (
          <Alert severity="error" variant="outlined" sx={{ mx: 3, my: 1 }}>
            매장 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </Alert>
        )}

        {isSearched && !isFetching && stores.length === 0 && !isError && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            검색 결과가 없습니다.
          </Typography>
        )}

        <List disablePadding>
          {stores.map((store) => {
            const distanceLabel = formatDaisoDistance(store.distance);

            return (
              <ListItem key={store.storeCode} disablePadding divider>
                <ListItemButton onClick={() => handleSave(store)}>
                  <Storefront fontSize="small" color="action" sx={{ mr: 1.5 }} />
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">{store.storeName}</Typography>
                        {savedStoreCodes.has(store.storeCode) && <Chip size="small" variant="outlined" label="저장됨" />}
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                        {[distanceLabel, store.address].filter(Boolean).join(' · ')}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button fullWidth onClick={close}>
          닫기
        </Button>
      </Box>
    </Stack>
  );
}

export default DaisoStoreSelectDialog;
