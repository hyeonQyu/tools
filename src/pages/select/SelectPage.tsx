import { AppRouteNode, checkRouteNode, getPathnameFromNode, useAppRoutes, useTypedNavigate } from '@/routes';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { cloneElement, ReactElement, ReactNode } from 'react';

interface Tool {
  key: string;
  name: string;
  icon: ReactNode;
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
        icon: node._metadata.icon,
        path: path as string,
      };
    });

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        툴 선택
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {tools.map((tool) => (
          <Card
            key={tool.key}
            sx={{
              height: '100%',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
          >
            <CardActionArea
              onClick={() => navigate(tool.path as Parameters<typeof navigate>[0])}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1,
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                }}
              >
                {tool.icon && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    {typeof tool.icon === 'object' && 'type' in tool.icon
                      ? cloneElement(tool.icon as ReactElement, { sx: { fontSize: 28 } })
                      : tool.icon}
                  </Box>
                )}
                <Typography variant="body1" component="div" fontWeight={500}>
                  {tool.name}
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
