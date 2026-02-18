import { BudgetingService, BudgetingServiceDependencies } from '@/features/budgeting/data/services/budgeting.service.types';
import { getServiceCreator } from '@/firebase';

export const createBudgetingService = getServiceCreator<BudgetingService, BudgetingServiceDependencies>(({ budgetingRepository }) => {
  return {
    save: async (payload) => {
      const exists = await budgetingRepository.exists();
      if (exists) {
        await budgetingRepository.update(payload);
      } else {
        await budgetingRepository.create(payload);
      }
    },
    load: async () => {
      const exists = await budgetingRepository.exists();
      if (!exists) return null;
      return budgetingRepository.read();
    },
  };
});
