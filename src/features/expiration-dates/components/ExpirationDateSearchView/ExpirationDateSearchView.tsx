import { useOpenExpirationDateItemDialog } from '@/features/expiration-dates/hooks';
import { useExpirationDateStore } from '@/features/expiration-dates/stores';
import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { getExpirationStatus } from '@/features/expiration-dates/utils';
import { Search } from '@mui/icons-material';
import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import ExpirationDateGroupToggle from './ExpirationDateGroupToggle';

const STATUS_COLOR = { expired: 'error', soon: 'warning', normal: 'default' } as const;
const STATUS_LABEL = { expired: '만료됨', soon: '임박', normal: undefined } as const;

function ExpirationDateSearchView() {
  const items = useExpirationDateStore((s) => s.items);
  const groupBy = useExpirationDateStore((s) => s.groupBy);
  const { openEdit } = useOpenExpirationDateItemDialog();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.location.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.memo ?? '').toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q),
    );
  }, [items, search]);

  const grouped = useMemo(() => {
    if (groupBy === 'location') {
      const map = new Map<string, ExpirationDateItemEntity[]>();
      for (const item of filtered) {
        const key = item.location || '위치 없음';
        map.set(key, [...(map.get(key) ?? []), item]);
      }
      return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }
    // date grouping
    const map = new Map<string, ExpirationDateItemEntity[]>();
    for (const item of filtered) {
      const d = item.expirationDate;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupBy]);

  return (
    <Stack sx={{ height: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 위치, 태그, 메모 검색"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <ExpirationDateGroupToggle />
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {grouped.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              {search ? '검색 결과가 없습니다.' : '등록된 물품이 없습니다.'}
            </Typography>
          </Box>
        ) : (
          grouped.map(([groupKey, groupItems]) => (
            <Box key={groupKey}>
              <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {groupBy === 'date' ? formatDateGroupKey(groupKey) : groupKey}
                </Typography>
              </Box>
              <Divider />
              <List disablePadding>
                {groupItems.map((item) => {
                  const status = getExpirationStatus(item.expirationDate);
                  const statusLabel = STATUS_LABEL[status];
                  const d = item.expirationDate;
                  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

                  return (
                    <ListItem key={item.id} disablePadding divider>
                      <ListItemButton onClick={() => openEdit(item)}>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                              <Typography variant="body2">{item.name}</Typography>
                              {statusLabel && (
                                <Chip
                                  label={statusLabel}
                                  color={STATUS_COLOR[status]}
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                              )}
                            </Stack>
                          }
                          secondary={
                            <Stack direction="row" gap={1} flexWrap="wrap" mt={0.25}>
                              <Typography variant="caption" color="text.secondary">
                                {dateStr}
                              </Typography>
                              {groupBy === 'date' && item.location && (
                                <Typography variant="caption" color="text.secondary">
                                  · {item.location}
                                </Typography>
                              )}
                              {item.tags.map((tag) => (
                                <Typography key={tag} variant="caption" color="text.secondary">
                                  #{tag}
                                </Typography>
                              ))}
                            </Stack>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))
        )}
      </Box>
    </Stack>
  );
}

function formatDateGroupKey(key: string): string {
  const [y, m, d] = key.split('-');
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
}

export default ExpirationDateSearchView;
