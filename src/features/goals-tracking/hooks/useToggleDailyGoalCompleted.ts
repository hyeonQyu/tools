import {
  getGoalsCompleteMutationOptions,
  getGoalsFindByDateQueryOptions,
  getGoalsUncompleteMutationOptions,
} from '@/features/goals-tracking/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleDailyGoalCompleted = (date: Date) => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { queryKey, queryFn } = getGoalsFindByDateQueryOptions(date);
  type GoalsFindByDateData = Awaited<ReturnType<typeof queryFn>>;

  const { mutateAsync: completeGoal } = useMutation(getGoalsCompleteMutationOptions());
  const { mutateAsync: uncompleteGoal } = useMutation(getGoalsUncompleteMutationOptions());

  const updateGoalChecked = (goalId: string, checked: boolean) => {
    queryClient.setQueryData<GoalsFindByDateData>(queryKey, (previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        goals: previous.goals.map((item) => (item.goal.id === goalId ? { ...item, done: checked } : item)),
      };
    });
  };

  return async (goalId: string) => {
    const payload = { goalId, date };
    await queryClient.cancelQueries({ queryKey });

    const current = queryClient.getQueryData<GoalsFindByDateData>(queryKey)?.goals.find((item) => item.goal.id === goalId)?.done;
    if (current === undefined) return;

    const nextChecked = !current;
    const previous = queryClient.getQueryData<GoalsFindByDateData>(queryKey);

    updateGoalChecked(goalId, nextChecked);

    try {
      if (nextChecked) {
        await completeGoal(payload);
      } else {
        await uncompleteGoal(payload);
      }
    } catch (e) {
      console.error(e);

      if (previous) {
        queryClient.setQueryData(queryKey, previous);
      }
    }
  };
};
