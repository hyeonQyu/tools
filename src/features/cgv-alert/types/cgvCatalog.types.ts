import { z } from 'zod';

/**
 * CGV 극장/영화 목록. 브라우저에서 CGV API를 직접 호출할 수 없어(CORS 미허용)
 * Cloud Functions의 `getCgvCatalog` 콜러블을 통해 받아온다.
 */
export const cgvRegionSchema = z.object({
  regnGrpCd: z.string(),
  regnGrpNm: z.string(),
});
export type CgvRegion = z.infer<typeof cgvRegionSchema>;

export const cgvSiteSchema = z.object({
  regnGrpCd: z.string(),
  siteNo: z.string(),
  siteNm: z.string(),
});
export type CgvSite = z.infer<typeof cgvSiteSchema>;

export const cgvMovieSchema = z.object({
  movNo: z.string(),
  movNm: z.string(),
});
export type CgvMovie = z.infer<typeof cgvMovieSchema>;

export const cgvCatalogSchema = z.object({
  regions: z.array(cgvRegionSchema),
  sites: z.array(cgvSiteSchema),
  movies: z.array(cgvMovieSchema),
});
export type CgvCatalog = z.infer<typeof cgvCatalogSchema>;

/** 특정 극장에서 실제 운영 중인 특별관 등급. */
export const cgvSiteSpecialScreenSchema = z.object({
  code: z.string(),
  name: z.string(),
});
export type CgvSiteSpecialScreen = z.infer<typeof cgvSiteSpecialScreenSchema>;
