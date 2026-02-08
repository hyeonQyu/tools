import SelectPage from '@/pages/select/SelectPage';
import { AppRouteNode, AppRouteTree, checkNestedRouteTree, checkRouteNode, useAppRoutes, useTypedNavigate } from '@/routes';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

type RouteNodeWithPath = {
  node: AppRouteNode;
  path: string;
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
  const navigate = useTypedNavigate();

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
