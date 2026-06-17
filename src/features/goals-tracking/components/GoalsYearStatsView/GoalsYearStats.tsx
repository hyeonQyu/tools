import { SortableItem } from '@/components/SortableItem';
import { GoalYearStatsCard } from '@/features/goals-tracking/components/GoalYearStatsCard';
import { useReorderGoals, useYearlyGoals } from '@/features/goals-tracking/hooks';
import { useGoalsTrackingYearStore } from '@/features/goals-tracking/stores';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Stack, Typography } from '@mui/material';
import { HTMLAttributes, useMemo, useState } from 'react';

interface GoalsYearStatsProps {
  search: string;
}

function GoalsYearStats({ search }: GoalsYearStatsProps) {
  const year = useGoalsTrackingYearStore((store) => store.year);
  const serverGoals = useYearlyGoals(year);
  const reorderGoals = useReorderGoals();

  const [optimisticGoals, setOptimisticGoals] = useState<typeof serverGoals | null>(null);
  const goals = optimisticGoals ?? serverGoals;

  const isSearching = search.trim().length > 0;

  const filteredGoals = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return goals;
    return goals.filter(({ goal }) => goal.name.toLowerCase().includes(q));
  }, [goals, search]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isSearching) return;
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

  if (isSearching && filteredGoals.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          검색 결과가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <DndContext sensors={isSearching ? [] : sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filteredGoals.map(({ goal }) => goal.id)} strategy={verticalListSortingStrategy}>
        <Stack gap={1.6}>
          {filteredGoals.map(({ goal, doneDates }) => (
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
