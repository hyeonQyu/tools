import SelectPage from '@/pages/select/SelectPage';
import { AppRouteNode, AppRouteTree, useAppRoutes, useTypedNavigation } from '@/routes';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

type RouteNodeWithPath = {
  node: AppRouteNode;
  path: string;
};

const checkRouteNode = (obj: unknown): obj is AppRouteNode => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_metadata' in obj &&
    typeof (obj as AppRouteNode)._metadata === 'object' &&
    (obj as AppRouteNode)._metadata !== null &&
    'component' in (obj as AppRouteNode)._metadata
  );
};

const checkNestedRouteTree = (obj: unknown): obj is AppRouteTree => {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) => {
    const v = (obj as Record<string, unknown>)[k];
    return v != null && typeof v === 'object';
  });
};

const getRouteNodes = (routeTree: AppRouteTree, pathPrefix: string[] = []): RouteNodeWithPath[] => {
  return Object.entries(routeTree).reduce<RouteNodeWithPath[]>((acc, [key, value]) => {
    if (value == null || typeof value !== 'object') return acc;

    const childKeys = Object.keys(value).filter((k) => k !== '_metadata');

    if (childKeys.length > 0 && checkNestedRouteTree(value)) {
      acc.push(...getRouteNodes(value, pathPrefix.concat(key)));
    } else if (checkRouteNode(value)) {
      acc.push({
        node: value,
        path: `/${pathPrefix.concat(key).join('/')}`,
      });
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
