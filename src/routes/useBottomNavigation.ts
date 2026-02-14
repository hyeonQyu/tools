import { getPathnameFromNode, useAppRoutes } from '@/routes';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useBottomNavigation = () => {
  const location = useLocation();
  const currentPathname = location.pathname;
  const appRoutes = useAppRoutes();

  const navigationProps = useMemo(() => {
    const navigationRouteNodes = [appRoutes.select] as const;

    return navigationRouteNodes.map((routeNode) => {
      const pathname = getPathnameFromNode(routeNode) ?? '';
      const label = routeNode._metadata.name;

      return {
        pathname,
        label,
        iconOutlined: routeNode._metadata.icon?.outlined ?? null,
        iconFilled: routeNode._metadata.icon?.filled ?? null,
      };
    });
  }, [appRoutes]);

  const currentNavigationIndex = useMemo(() => {
    const index = navigationProps.findIndex((item) => currentPathname.startsWith(item.pathname));
    return index;
  }, [currentPathname, navigationProps]);

  return {
    navigationData: navigationProps,
    currentNavigationIndex,
  };
};
