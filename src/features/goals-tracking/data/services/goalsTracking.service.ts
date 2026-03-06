import {
  GoalsTrackingService,
  GoalsTrackingServiceDependencies,
} from '@/features/goals-tracking/data/services/goalsTracking.service.types';
import { getServiceCreator } from '@/firebase';
import { ConstraintError } from '@/lib';

export const createGoalsTrackingService = getServiceCreator<GoalsTrackingService, GoalsTrackingServiceDependencies>(
  ({ goalsRepository, goalDailyRecordsRepository }) => {
    return {
      create: async (payload) => {
        const existing = await goalsRepository.findByName(payload.name);
        if (existing) throw new ConstraintError('이미 같은 이름의 목표가 존재합니다.');
        await goalsRepository.create(payload);
      },

      getDailyRecords: async (date) => {
        const [goals, records] = await Promise.all([
          goalsRepository.findAll(),
          goalDailyRecordsRepository.findByDate(date),
        ]);

        const recordedIds = new Set(records.map((r) => r.goalId));

        return {
          date,
          goals: goals.map(({ userId: _userId, ...goal }) => ({
            goal,
            done: recordedIds.has(goal.id),
          })),
        };
      },
    };
  },
);
