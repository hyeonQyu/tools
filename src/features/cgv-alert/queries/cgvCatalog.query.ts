import { fetchCgvCatalog, fetchCgvSiteSpecialScreens } from '@/features/cgv-alert/data';
import { TIME_UNIT } from '@/lib';

/** 극장/영화 목록은 사용자와 무관한 공용 데이터라 쿼리키에 uid를 넣지 않는다. */
export const getCgvCatalogQueryOptions = () => ({
  queryKey: ['cgv-alert', 'catalog'] as const,
  queryFn: () => fetchCgvCatalog(),
  staleTime: TIME_UNIT.unitOfMs.asHour,
  gcTime: TIME_UNIT.unitOfMs.asHour,
});

export const getCgvSiteSpecialScreensQueryOptions = (siteNo: string) => ({
  queryKey: ['cgv-alert', 'site-special-screens', siteNo] as const,
  queryFn: () => fetchCgvSiteSpecialScreens(siteNo),
  enabled: siteNo !== '',
  staleTime: TIME_UNIT.unitOfMs.asHour,
  gcTime: TIME_UNIT.unitOfMs.asHour,
});
