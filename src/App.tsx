import SelectPage from '@/pages/select/SelectPage';
import { AppRouteNode, AppRouteTree, useAppRoutes, useTypedNavigation } from '@/routes';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

type RouteNodeWithPath = {
  node: AppRouteNode;
  path: string;
};

const getRouteNodes = (routeTree: AppRouteTree, paths: string[] = []): RouteNodeWithPath[] => {
  const checkRouteNode = (obj: unknown): obj is AppRouteNode => {
    if (typeof obj === 'object' && obj !== null && '_metadata' in obj) {
      return typeof obj._metadata === 'object' && obj._metadata !== null && 'component' in obj._metadata;
    }
    return false;
  };

  const checkRouteTree = (obj: unknown): obj is AppRouteTree => {
    return typeof obj === 'object' && obj !== null && !('_metadata' in obj);
  };

  return Object.entries(routeTree).reduce<RouteNodeWithPath[]>((acc, [key, value]) => {
    if (checkRouteNode(value)) {
      acc.push({
        node: value,
        path: `/${paths.concat(key).join('/')}`,
      });
    } else if (checkRouteTree(value)) {
      acc.push(...getRouteNodes(value, paths.concat(key)));
    }
    return acc;
  }, []);
};

function App() {
  const appRoutes = useAppRoutes();
  const routeNodes = getRouteNodes(appRoutes);
  const location = useLocation();
  const navigate = useTypedNavigation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/select');
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route index element={<SelectPage />} />
      {routeNodes.map(({ node, path }) => (
        <Route key={path} path={path} element={node._metadata.component} />
      ))}
    </Routes>
  );
}

export default App;
