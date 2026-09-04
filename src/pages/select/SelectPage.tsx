import { checkChosungOnly, getChosung, normalizeSearchText } from '@/lib';
import { AppRouteNode, BOTTOM_NAVIGATION_CLEARANCE, checkRouteNode, getPathnameFromNode, useAppRoutes, useTypedNavigate } from '@/routes';
import { pxToRem } from '@/styles';
import { Search } from '@mui/icons-material';
import { Box, InputAdornment, List, ListItemButton, Paper, Stack, TextField, Typography, useTheme } from '@mui/material';
import { ComponentType, useMemo, useState } from 'react';

interface Tool {
  key: string;
  name: string;
  IconComponent: ComponentType | null;
  path: string;
  /** 검색 매칭 대상 (이름, 라우트 키, 별칭 키워드) */
  searchTargets: string[];
}

const checkToolMatched = ({ searchTargets }: Tool, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const normalizedTargets = searchTargets.map(normalizeSearchText);
  if (normalizedTargets.some((target) => target.includes(normalizedQuery))) return true;

  return checkChosungOnly(normalizedQuery) && normalizedTargets.some((target) => getChosung(target).includes(normalizedQuery));
};

function SelectPage() {
  const appRoutes = useAppRoutes();
  const navigate = useTypedNavigate();
  const { glass } = useTheme();
  const [search, setSearch] = useState('');

  const tools: Tool[] = useMemo(
    () =>
      Object.entries(appRoutes.tool)
        .filter(([_, value]) => checkRouteNode(value))
        .map(([key, value]) => {
          const node = value as AppRouteNode;
          const toolKey = key as keyof typeof appRoutes.tool;
          const path = getPathnameFromNode(appRoutes.tool[toolKey] as AppRouteNode);
          const name = node._metadata.name || '';
          return {
            key,
            name,
            IconComponent: node._metadata.icon?.outlined ?? null,
            path: path as string,
            searchTargets: [name, key, ...(node._metadata.keywords ?? [])],
          };
        }),
    [appRoutes],
  );

  const filteredTools = useMemo(() => tools.filter((tool) => checkToolMatched(tool, search)), [tools, search]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2.5, pt: 3, pb: pxToRem(BOTTOM_NAVIGATION_CLEARANCE) }}>
      <Stack spacing={2}>
        <Typography variant="h5">툴 선택</Typography>

        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="도구 이름, 초성, 키워드 검색"
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

        {filteredTools.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Typography variant="body2" color="text.secondary">
              검색 결과가 없습니다.
            </Typography>
          </Box>
        ) : (
          <Paper>
            <List disablePadding>
              {filteredTools.map(({ key, name, IconComponent, path }, index) => (
                <ListItemButton
                  key={key}
                  onClick={() => navigate(path as Parameters<typeof navigate>[0])}
                  sx={{
                    gap: 1.5,
                    minHeight: pxToRem(52),
                    px: 1.75,
                    borderTop: index === 0 ? 'none' : `1px solid ${glass.hairline}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '7px',
                      bgcolor: glass.iconWell,
                      color: 'text.primary',
                      '& svg': { fontSize: pxToRem(18) },
                    }}
                  >
                    {IconComponent && <IconComponent />}
                  </Box>
                  <Typography variant="body1" fontWeight={500} sx={{ flex: 1, letterSpacing: '-0.01em' }}>
                    {name}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

export default SelectPage;
