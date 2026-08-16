import { CgvCatalog, CgvSiteSpecialScreen, cgvCatalogSchema, cgvSiteSpecialScreenSchema } from '@/features/cgv-alert/types';
import { getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { z } from 'zod';

/**
 * CGV API는 CORS를 허용하지 않아 브라우저에서 직접 호출할 수 없다.
 * Cloud Functions 콜러블을 경유하며, 리전은 함수 배포 리전과 반드시 일치해야 한다.
 */
export const CGV_FUNCTIONS_REGION = 'asia-northeast3';

const getCgvFunctions = () => getFunctions(getApp(), CGV_FUNCTIONS_REGION);

export const fetchCgvCatalog = async (): Promise<CgvCatalog> => {
  const callable = httpsCallable<void, unknown>(getCgvFunctions(), 'getCgvCatalog');
  const { data } = await callable();
  return cgvCatalogSchema.parse(data);
};

export const fetchCgvSiteSpecialScreens = async (siteNo: string): Promise<CgvSiteSpecialScreen[]> => {
  const callable = httpsCallable<{ siteNo: string }, unknown>(getCgvFunctions(), 'getCgvSiteSpecialScreens');
  const { data } = await callable({ siteNo });
  return z.array(cgvSiteSpecialScreenSchema).parse(data);
};
