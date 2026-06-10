import { getServiceCreator } from '@/firebase';
import { ConstraintError } from '@/lib';
import { BudgetingPresetService, BudgetingPresetServiceDependencies } from './budgeting.preset.service.types';

export const createBudgetingPresetService = getServiceCreator<BudgetingPresetService, BudgetingPresetServiceDependencies>(
  ({ budgetingPresetRepository }) => {
    const assertUniqueName = async (name: string) => {
      const existing = await budgetingPresetRepository.findByName(name);
      if (existing) throw new ConstraintError(`"${name}" 이름의 예산안이 이미 존재합니다.`);
    };

    return {
      save: async (payload) => {
        await assertUniqueName(payload.name);
        return budgetingPresetRepository.create(payload);
      },
      findAll: () => budgetingPresetRepository.findAll(),
      rename: async (id, newName) => {
        const existing = await budgetingPresetRepository.findByName(newName);
        if (existing && existing.id !== id) {
          throw new ConstraintError(`"${newName}" 이름의 예산안이 이미 존재합니다.`);
        }
        await budgetingPresetRepository.rename(id, newName);
      },
      delete: (id) => budgetingPresetRepository.delete(id),
    };
  },
);
