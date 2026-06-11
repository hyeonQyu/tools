import { DocumentEntity } from '@/firebase';
import { z } from 'zod';

export const belongingItemSchema = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.array(z.string()),
  memo: z.string(),
});

export type BelongingItemPayload = z.infer<typeof belongingItemSchema>;
export type BelongingItemEntity = DocumentEntity<BelongingItemPayload> & { userId: string };

export const belongingSettingsSchema = z.object({
  locations: z.array(z.string()),
  tags: z.array(z.string()),
});

export type BelongingSettingsPayload = z.infer<typeof belongingSettingsSchema>;

export type BelongingGroupByType = 'location' | 'tag';
