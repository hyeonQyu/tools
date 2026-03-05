import { goalDailyRecordsRepository, goalsRepository } from '@/features/goals-tracking/data/repositories';
import { createGoalsTrackingService } from '@/features/goals-tracking/data/services';

export const goalsTrackingService = createGoalsTrackingService({ goalsRepository, goalDailyRecordsRepository });
