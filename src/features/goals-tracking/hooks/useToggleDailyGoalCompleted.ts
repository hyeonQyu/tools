import {
  getGoalsCompleteMutationOptions,
  getGoalsFindByDateQueryOptions,
  getGoalsFindByYearQueryOptions,
  getGoalsUncompleteMutationOptions,
} from '@/features/goals-tracking/queries';
import { toKstDateKey } from '@/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleDailyGoalCompleted = (date: Date) => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { queryKey: dailyQueryKey, queryFn: dailyQueryFn } = getGoalsFindByDateQueryOptions(date);
  type GoalsFindByDateData = Awaited<ReturnType<typeof dailyQueryFn>>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { queryKey: yearlyQueryKey, queryFn: yearlyQueryFn } = getGoalsFindByYearQueryOptions(date.getFullYear());
  type GoalsFindByYearData = Awaited<ReturnType<typeof yearlyQueryFn>>;

  const { mutateAsync: completeGoal } = useMutation(getGoalsCompleteMutationOptions());
  const { mutateAsync: uncompleteGoal } = useMutation(getGoalsUncompleteMutationOptions());

  const updateGoalChecked = (goalId: string, checked: boolean) => {
    queryClient.setQueryData<GoalsFindByDateData>(dailyQueryKey, (previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        goals: previous.goals.map((item) => (item.goal.id === goalId ? { ...item, done: checked } : item)),
      };
    });

    queryClient.setQueryData<GoalsFindByYearData>(yearlyQueryKey, (previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        goals: previous.goals.map((item) => {
          if (item.goal.id !== goalId) return item;

          const doneDates = checked ? [...item.doneDates, date] : item.doneDates.filter((d) => toKstDateKey(d) !== toKstDateKey(date));

          return { ...item, doneDates };
        }),
      };
    });
  };

  return async (goalId: string) => {
    const payload = { goalId, date };
    await queryClient.cancelQueries({ queryKey: dailyQueryKey });

    const current = queryClient.getQueryData<GoalsFindByDateData>(dailyQueryKey)?.goals.find((item) => item.goal.id === goalId)?.done;
    if (current === undefined) return;

    const nextChecked = !current;
    const previousDailyQueryData = queryClient.getQueryData<GoalsFindByDateData>(dailyQueryKey);
    const previousYearlyQueryData = queryClient.getQueryData<GoalsFindByYearData>(yearlyQueryKey);

    updateGoalChecked(goalId, nextChecked);

    try {
      if (nextChecked) {
        await completeGoal(payload);
      } else {
        await uncompleteGoal(payload);
      }
    } catch (e) {
      console.error(e);

      if (previousDailyQueryData) {
        queryClient.setQueryData(dailyQueryKey, previousDailyQueryData);
      }
      if (previousYearlyQueryData) {
        queryClient.setQueryData(yearlyQueryKey, previousYearlyQueryData);
      }
    }
  };
};
