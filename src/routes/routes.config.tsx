import BelongingsPage from '@/pages/belongings/BelongingsPage';
import BudgetingPage from '@/pages/budgeting/BudgetingPage';
import CgvAlertPage from '@/pages/cgv-alert/CgvAlertPage';
import DaisoShoppingPage from '@/pages/daiso-shopping/DaisoShoppingPage';
import ExpirationDatesPage from '@/pages/expiration-dates/ExpirationDatesPage';
import FuelPaymentPage from '@/pages/fuel-payment/FuelPaymentPage';
import GoalsTrackingPage from '@/pages/goals-tracking/GoalsTrackingPage';
import SelectPage from '@/pages/select/SelectPage';
import WsServerPage from '@/pages/ws-server/WsServerPage';
import { createAppRoutes } from '@hyeonqyu/typed-router-react';
import {
  Checklist,
  ChecklistOutlined,
  Dns,
  DnsOutlined,
  EventNote,
  EventNoteOutlined,
  Inventory2,
  Inventory2Outlined,
  LocalAtm,
  LocalAtmOutlined,
  LocalGasStation,
  LocalGasStationOutlined,
  ShoppingBasket,
  ShoppingBasketOutlined,
  Theaters,
  TheatersOutlined,
  ViewCarousel,
  ViewCarouselOutlined,
} from '@mui/icons-material';
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
    /** 도구 검색에서 이름 외에 추가로 매칭할 별칭 */
    keywords?: string[];
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
        keywords: ['예산', '분배', '가계부', '생활비', '월급', 'budget'],
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
        keywords: ['목표', '관리', '달성', '계획', '습관', 'goal', 'tracking'],
      },
    },

    'fuel-payment': {
      _metadata: {
        name: '주유비 결제',
        icon: {
          outlined: LocalGasStationOutlined,
          filled: LocalGasStation,
        },
        component: <FuelPaymentPage />,
        keywords: ['주유', '기름', '연료', '결제', '정산', '카풀', 'fuel', 'gas'],
      },
    },

    'expiration-dates': {
      _metadata: {
        name: '유통기한 관리',
        icon: {
          outlined: EventNoteOutlined,
          filled: EventNote,
        },
        component: <ExpirationDatesPage />,
        keywords: ['유통기한', '소비기한', '식품', '냉장고', '만료', 'expiration'],
      },
    },

    belongings: {
      _metadata: {
        name: '물건 관리',
        icon: {
          outlined: Inventory2Outlined,
          filled: Inventory2,
        },
        component: <BelongingsPage />,
        keywords: ['물건', '물품', '보관', '위치', '소지품', 'belongings'],
      },
    },

    'cgv-alert': {
      _metadata: {
        name: 'CGV 예매 알림',
        icon: {
          outlined: TheatersOutlined,
          filled: Theaters,
        },
        component: <CgvAlertPage />,
        keywords: ['씨지비', '영화', '예매', '알림', '좌석', '상영', 'movie'],
      },
    },

    'daiso-shopping': {
      _metadata: {
        name: '다이소 장보기',
        icon: {
          outlined: ShoppingBasketOutlined,
          filled: ShoppingBasket,
        },
        component: <DaisoShoppingPage />,
        keywords: ['다이소', '장보기', '쇼핑', '재고', '매장', '생필품', 'shopping'],
      },
    },

    'ws-server': {
      _metadata: {
        name: '웹소켓 서버 관리',
        icon: {
          outlined: DnsOutlined,
          filled: Dns,
        },
        component: <WsServerPage />,
        keywords: ['웹소켓', '소켓', '서버', '관리', 'websocket', 'ws', 'server'],
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
