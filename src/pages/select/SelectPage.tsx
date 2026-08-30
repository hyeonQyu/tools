import { checkChosungOnly, getChosung, normalizeSearchText } from '@/lib';
import { AppRouteNode, checkRouteNode, getPathnameFromNode, useAppRoutes, useTypedNavigate } from '@/routes';
import { Search } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, InputAdornment, TextField, Typography } from '@mui/material';
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
            IconComponent: node._metadata.icon?.filled ?? null,
            path: path as string,
            searchTargets: [name, key, ...(node._metadata.keywords ?? [])],
          };
        }),
    [appRoutes],
  );

  const filteredTools = useMemo(() => tools.filter((tool) => checkToolMatched(tool, search)), [tools, search]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        툴 선택
      </Typography>

      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="도구 이름, 초성, 키워드 검색"
        size="small"
        fullWidth
        sx={{ mb: 3 }}
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(5, 1fr)',
            },
            gap: 1.5,
          }}
        >
          {filteredTools.map(({ key, name, IconComponent, path }) => (
            <Card
              key={key}
              sx={{
                aspectRatio: '1',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(path as Parameters<typeof navigate>[0])}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    '&:last-child': { pb: 1.5 },
                  }}
                >
                  {IconComponent && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      <IconComponent />
                    </Box>
                  )}
                  <Typography variant="caption" component="div" fontWeight={500}>
                    {name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default SelectPage;
