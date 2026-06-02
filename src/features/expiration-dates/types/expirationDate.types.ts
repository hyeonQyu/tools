import { DocumentEntity } from '@/firebase';
import { z } from 'zod';

export const expirationDateItemSchema = z.object({
  name: z.string(),
  expirationDate: z.date(),
  location: z.string(),
  tags: z.array(z.string()),
  memo: z.string(),
});

export type ExpirationDateItemPayload = z.infer<typeof expirationDateItemSchema>;
export type ExpirationDateItemEntity = DocumentEntity<ExpirationDateItemPayload> & { userId: string };

export const expirationDateSettingsSchema = z.object({
  locations: z.array(z.string()),
  tags: z.array(z.string()),
});

export type ExpirationDateSettingsPayload = z.infer<typeof expirationDateSettingsSchema>;

export type ExpirationDateViewType = 'calendar' | 'search';
export type ExpirationDateGroupByType = 'location' | 'date';
