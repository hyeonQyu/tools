import { DocumentEntity } from '@/firebase';
import { z } from 'zod';

export const pushTokenSchema = z.object({
  token: z.string(),
  userAgent: z.string(),
});

export type PushTokenPayload = z.infer<typeof pushTokenSchema>;
/** 문서 ID가 FCM 토큰 문자열이므로 `id`와 `token`은 항상 같은 값이다. */
export type PushTokenEntity = DocumentEntity<PushTokenPayload> & { userId: string };
