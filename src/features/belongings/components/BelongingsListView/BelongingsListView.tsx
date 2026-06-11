import { useOpenBelongingItemDialog } from '@/features/belongings/hooks';
import { useBelongingStore } from '@/features/belongings/stores';
import { BelongingItemEntity } from '@/features/belongings/types';
import { Search } from '@mui/icons-material';
import { Box, Divider, InputAdornment, List, ListItem, ListItemButton, ListItemText, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import BelongingsGroupToggle from './BelongingsGroupToggle';

function BelongingsListView() {
  const items = useBelongingStore((s) => s.items);
  const groupBy = useBelongingStore((s) => s.groupBy);
  const { openEdit } = useOpenBelongingItemDialog();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.memo ?? '').toLowerCase().includes(q),
    );
  }, [items, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, BelongingItemEntity[]>();

    if (groupBy === 'location') {
      for (const item of filtered) {
        const key = item.location || '위치 없음';
        map.set(key, [...(map.get(key) ?? []), item]);
      }
    } else {
      for (const item of filtered) {
        const itemTags = item.tags.length > 0 ? item.tags : ['태그 없음'];
        for (const tag of itemTags) {
          map.set(tag, [...(map.get(tag) ?? []), item]);
        }
      }
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, groupItems]) => [key, groupItems.sort((a, b) => a.name.localeCompare(b.name))] as const);
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
        <BelongingsGroupToggle />
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {grouped.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              {search ? '검색 결과가 없습니다.' : '등록된 물건이 없습니다.'}
            </Typography>
          </Box>
        ) : (
          grouped.map(([groupKey, groupItems]) => (
            <Box key={groupKey}>
              <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {groupKey}
                </Typography>
              </Box>
              <Divider />
              <List disablePadding>
                {groupItems.map((item) => (
                  <ListItem key={`${groupKey}-${item.id}`} disablePadding divider>
                    <ListItemButton onClick={() => openEdit(item)}>
                      <ListItemText
                        primary={<Typography variant="body2">{item.name}</Typography>}
                        secondary={
                          <Stack direction="row" gap={1} flexWrap="wrap" mt={0.25}>
                            {groupBy === 'tag' && item.location && (
                              <Typography variant="caption" color="text.secondary">
                                {item.location}
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
                ))}
              </List>
            </Box>
          ))
        )}
      </Box>
    </Stack>
  );
}

export default BelongingsListView;
