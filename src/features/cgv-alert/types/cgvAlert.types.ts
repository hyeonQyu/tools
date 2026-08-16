import { DocumentEntity } from '@/firebase';
import { z } from 'zod';

export const cgvTriggerTypeSchema = z.enum(['OPEN_DATE', 'NEW_SHOWTIME', 'SEAT_AVAILABLE']);
export type CgvTriggerType = z.infer<typeof cgvTriggerTypeSchema>;

/** 감시할 상영일 범위. `ALL`은 CGV가 열어둔 모든 날짜를 뜻한다. */
export const cgvDateRangeSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ALL') }),
  z.object({ type: z.literal('WITHIN_DAYS'), days: z.number().int().min(1).max(60) }),
  /** `YYYYMMDD` */
  z.object({ type: z.literal('RANGE'), from: z.string(), to: z.string() }),
]);
export type CgvDateRange = z.infer<typeof cgvDateRangeSchema>;

/** `HHmm`. 상영 시작 시각 기준으로 비교한다. */
export const cgvTimeRangeSchema = z.object({
  startTm: z.string(),
  endTm: z.string(),
});
export type CgvTimeRange = z.infer<typeof cgvTimeRangeSchema>;

/** 빈 배열/`null`은 "제한 없음"을 뜻한다. */
export const cgvWatchFilterSchema = z.object({
  sscnsGradCds: z.array(z.string()),
  movNo: z.string().nullable(),
  movNm: z.string().nullable(),
  dateRange: cgvDateRangeSchema,
  weekdays: z.array(z.number().int().min(0).max(6)),
  timeRange: cgvTimeRangeSchema.nullable(),
});
export type CgvWatchFilter = z.infer<typeof cgvWatchFilterSchema>;

export const cgvWatchSchema = z.object({
  enabled: z.boolean(),
  siteNo: z.string(),
  siteNm: z.string(),
  triggers: z.array(cgvTriggerTypeSchema).min(1),
  filters: cgvWatchFilterSchema,
});

export type CgvWatchPayload = z.infer<typeof cgvWatchSchema>;
export type CgvWatchEntity = DocumentEntity<CgvWatchPayload> & { userId: string };

export const cgvNotificationSchema = z.object({
  watchId: z.string(),
  type: cgvTriggerTypeSchema,
  title: z.string(),
  body: z.string(),
  linkUrl: z.string(),
  siteNo: z.string(),
  siteNm: z.string(),
  /** `YYYYMMDD` */
  scnYmd: z.string(),
});

export type CgvNotificationPayload = z.infer<typeof cgvNotificationSchema>;
export type CgvNotificationEntity = DocumentEntity<CgvNotificationPayload> & { userId: string };

export type CgvAlertViewType = 'watches' | 'history';

export const getDefaultCgvWatchFilter = (): CgvWatchFilter => ({
  sscnsGradCds: [],
  movNo: null,
  movNm: null,
  dateRange: { type: 'ALL' },
  weekdays: [],
  timeRange: null,
});
