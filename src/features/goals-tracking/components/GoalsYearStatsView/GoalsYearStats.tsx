import { SortableItem } from '@/components/SortableItem';
import { GoalYearStatsCard } from '@/features/goals-tracking/components/GoalYearStatsCard';
import { useReorderGoals, useYearlyGoals } from '@/features/goals-tracking/hooks';
import { useGoalsTrackingYearStore } from '@/features/goals-tracking/stores';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Stack } from '@mui/material';
import { HTMLAttributes, useState } from 'react';

function GoalsYearStats() {
  const year = useGoalsTrackingYearStore((store) => store.year);
  const serverGoals = useYearlyGoals(year);
  const reorderGoals = useReorderGoals();

  const [optimisticGoals, setOptimisticGoals] = useState<typeof serverGoals | null>(null);
  const goals = optimisticGoals ?? serverGoals;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = goals.findIndex(({ goal }) => goal.id === active.id);
    const newIndex = goals.findIndex(({ goal }) => goal.id === over.id);
    const reordered = arrayMove(goals, oldIndex, newIndex);

    setOptimisticGoals(reordered);
    reorderGoals(
      reordered.map(({ goal }) => goal.id),
      {
        onSuccess: () => setOptimisticGoals(null),
        onError: () => setOptimisticGoals(null),
      },
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={goals.map(({ goal }) => goal.id)} strategy={verticalListSortingStrategy}>
        <Stack gap={1.6}>
          {goals.map(({ goal, doneDates }) => (
            <SortableItem key={goal.id} id={goal.id}>
              {(dragHandleProps: HTMLAttributes<HTMLElement>) => (
                <GoalYearStatsCard year={year} goal={{ ...goal, doneDates }} dragHandleProps={dragHandleProps} />
              )}
            </SortableItem>
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}

export default GoalsYearStats;
