import { AppRouteNode, checkRouteNode, getPathnameFromNode, useAppRoutes, useTypedNavigate } from '@/routes';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { ComponentType } from 'react';

interface Tool {
  key: string;
  name: string;
  IconComponent: ComponentType | null;
  path: string;
}

function SelectPage() {
  const appRoutes = useAppRoutes();
  const navigate = useTypedNavigate();

  const tools: Tool[] = Object.entries(appRoutes.tool)
    .filter(([_, value]) => checkRouteNode(value))
    .map(([key, value]) => {
      const node = value as AppRouteNode;
      const toolKey = key as keyof typeof appRoutes.tool;
      const path = getPathnameFromNode(appRoutes.tool[toolKey] as AppRouteNode);
      return {
        key,
        name: node._metadata.name || '',
        IconComponent: node._metadata.icon?.filled ?? null,
        path: path as string,
      };
    });

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        툴 선택
      </Typography>

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
        {tools.map(({ key, name, IconComponent, path }) => (
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
    </Box>
  );
}

export default SelectPage;
