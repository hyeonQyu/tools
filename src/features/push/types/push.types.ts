import { DocumentEntity } from '@/firebase';
import { z } from 'zod';

export const pushTokenSchema = z.object({
  token: z.string(),
  userAgent: z.string(),
});

export type PushTokenPayload = z.infer<typeof pushTokenSchema>;

/**
 * 기기별 알림 옵션. 앱을 열 때마다 실행되는 토큰 재등록(`pushTokenSchema`)과 분리해 둔다.
 * 같은 페이로드에 넣으면 앱을 열 때마다 사용자가 켠 설정이 기본값으로 되돌아간다.
 */
export const pushTokenSettingsSchema = z.object({
  /**
   * 워치까지 확실히 전달되도록 알림을 강하게 띄운다.
   * 서버가 페이로드에 실어 보내고 `public/firebase-messaging-sw.js`가 알림 옵션에 반영한다.
   */
  watchAlert: z.boolean(),
});

export type PushTokenSettings = z.infer<typeof pushTokenSettingsSchema>;

/** 문서 ID가 FCM 토큰 문자열이므로 `id`와 `token`은 항상 같은 값이다. */
export type PushTokenEntity = DocumentEntity<PushTokenPayload> & { userId: string } & Partial<PushTokenSettings>;
