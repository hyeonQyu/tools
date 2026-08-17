import {
  daisoDisplayLocationResponseSchema,
  daisoInventoryResponseSchema,
  daisoProductDetailResponseSchema,
  daisoProductSearchResponseSchema,
} from '@/features/daiso-shopping/types';
import { DataError, TIME_UNIT, TimeoutError } from '@/lib';
import { z } from 'zod';
import { DaisoApiRepository } from './daisoApi.repository.types';

/** 다이소 공개 API 프록시 (https://github.com/hmmhmmhm/daiso-mcp) */
const DAISO_API_BASE_URL = 'https://mcp.aka.page/api/daiso';
const DAISO_API_TIMEOUT_MS = TIME_UNIT.unitOfMs.asSecond * 8;

export const DAISO_MAX_PAGE_SIZE = 100;

type QueryParams = Record<string, string | number | undefined>;

const buildUrl = (path: string, params: QueryParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    searchParams.set(key, String(value));
  });

  return `${DAISO_API_BASE_URL}${path}?${searchParams.toString()}`;
};

const requestDaisoApi = async <TSchema extends z.ZodTypeAny>(
  path: string,
  params: QueryParams,
  schema: TSchema,
): Promise<z.infer<TSchema>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DAISO_API_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path, params), { signal: controller.signal });

    if (!response.ok) {
      throw new DataError(`다이소 정보를 불러오지 못했습니다. (${response.status})`);
    }

    const parsed = schema.safeParse(await response.json());
    if (!parsed.success) {
      throw new DataError('다이소 응답 형식을 해석하지 못했습니다.');
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TimeoutError('다이소 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.');
    }
    if (error instanceof DataError) throw error;
    throw new DataError('다이소 서버에 연결하지 못했습니다.');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const daisoApiRepository: DaisoApiRepository = {
  searchProducts: async ({ keyword, page = 1, pageSize = 30 }) => {
    const response = await requestDaisoApi('/products', { q: keyword, page, pageSize }, daisoProductSearchResponseSchema);

    return {
      products: response.data.products,
      total: response.meta?.total ?? response.data.products.length,
    };
  },

  getProduct: async (productId) => {
    const response = await requestDaisoApi(`/products/${encodeURIComponent(productId)}`, {}, daisoProductDetailResponseSchema);
    return response.data;
  },

  getInventory: async ({ productId, keyword, lat, lng, page = 1, pageSize = DAISO_MAX_PAGE_SIZE }) => {
    const response = await requestDaisoApi('/inventory', { productId, keyword, lat, lng, page, pageSize }, daisoInventoryResponseSchema);
    const { storeInventory } = response.data;

    return {
      productId: response.data.productId,
      onlineStock: response.data.onlineStock,
      totalStores: storeInventory.totalStores,
      inStockCount: storeInventory.inStockCount,
      stores: storeInventory.stores,
    };
  },

  getDisplayLocation: async ({ productId, storeCode }) => {
    const response = await requestDaisoApi('/display-location', { productId, storeCode }, daisoDisplayLocationResponseSchema);

    return {
      hasLocation: response.data.hasLocation,
      locations: response.data.locations,
    };
  },
};
