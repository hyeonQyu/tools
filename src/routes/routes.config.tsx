import BudgetingPage from '@/pages/budgeting/BudgetingPage';
import GoalsTrackingPage from '@/pages/goals-tracking/GoalsTrackingPage';
import SelectPage from '@/pages/select/SelectPage';
import { createAppRoutes } from '@hyeonqyu/typed-router-react';
import { Checklist, ChecklistOutlined, LocalAtm, LocalAtmOutlined, ViewCarousel, ViewCarouselOutlined } from '@mui/icons-material';
import { ComponentType, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AppRoutesProvider, useAppRoutes, useTypedNavigate, useCurrentRouteNode, getPathnameFromNode, _types } = createAppRoutes<
  {
    name?: string;
    component: ReactNode;
    icon?: {
      outlined: ComponentType;
      filled: ComponentType;
    };
  },
  Record<string, unknown>
>()({
  select: {
    _metadata: {
      name: '선택',
      icon: {
        outlined: ViewCarouselOutlined,
        filled: ViewCarousel,
      },
      component: <SelectPage />,
    },
  },
  tool: {
    _metadata: {
      component: null,
    },

    budgeting: {
      _metadata: {
        name: '예산 분배',
        icon: {
          outlined: LocalAtmOutlined,
          filled: LocalAtm,
        },
        component: <BudgetingPage />,
      },
    },

    'goals-tracking': {
      _metadata: {
        name: '목표 관리',
        icon: {
          outlined: ChecklistOutlined,
          filled: Checklist,
        },
        component: <GoalsTrackingPage />,
      },
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export { AppRoutesProvider, getPathnameFromNode, useAppRoutes, useCurrentRouteNode, useTypedNavigate };
export type AppRouteNode = typeof _types.AppRouteNode;
export type AppRoutesContext = typeof _types.AppRoutesContext;
export type AppRoutesMetadata = typeof _types.AppRoutesMetadata;
export type AppPartialRouteTree = typeof _types.AppPartialRouteTree;
export type AppRouteTree = typeof _types.AppRouteTree;
export type AppRoutes = typeof _types.AppRoutes;
export type AppRoutesPathname = typeof _types.AppRoutesPathname;
export type SearchParamsForPath = typeof _types.SearchParamsForPath;
