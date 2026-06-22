import { DocumentEntity } from '@/firebase';
import { z } from 'zod';

export const wsServerSchema = z.object({
  url: z.string(),
  healthCheckEndpoint: z.string().optional(),
  displayName: z.string().optional(),
});

export type WsServerPayload = z.infer<typeof wsServerSchema>;
export type WsServerEntity = DocumentEntity<WsServerPayload> & { userId: string };
