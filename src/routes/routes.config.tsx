import BudgetingPage from '@/pages/budgeting/BudgetingPage';
import SelectPage from '@/pages/select/SelectPage';
import { createAppRoutes } from '@hyeonqyu/typed-router-react';
import { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AppRoutesProvider, useAppRoutes, useTypedNavigation, _types } = createAppRoutes<
  { component: ReactNode },
  Record<string, unknown>
>()({
  select: {
    _metadata: {
      component: <SelectPage />,
    },
  },
  budgeting: {
    _metadata: {
      component: <BudgetingPage />,
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export { AppRoutesProvider, useAppRoutes, useTypedNavigation };
export type AppRouteNode = typeof _types.AppRouteNode;
export type AppRoutesContext = typeof _types.AppRoutesContext;
export type AppRoutesMetadata = typeof _types.AppRoutesMetadata;
export type AppPartialRouteTree = typeof _types.AppPartialRouteTree;
export type AppRouteTree = typeof _types.AppRouteTree;
export type AppRoutes = typeof _types.AppRoutes;
export type AppRoutesPathname = typeof _types.AppRoutesPathname;
export type SearchParamsForPath = typeof _types.SearchParamsForPath;
