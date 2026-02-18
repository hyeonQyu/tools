import { SortableItem } from '@/components/SortableItem';
import { BudgetingItem } from '@/features/budgeting';
import { useBudgetingStore } from '@/features/budgeting/stores';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { HTMLAttributes } from 'react';

function BudgetItemList() {
  const items = useBudgetingStore((store) => store.items);
  const addItem = useBudgetingStore((store) => store.addItem);
  const reorderItems = useBudgetingStore((store) => store.reorderItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      reorderItems(newItems);
    }
  };

  return (
    <Stack spacing={1}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {(dragHandleProps: HTMLAttributes<HTMLElement>) => <BudgetingItem itemId={item.id} dragHandleProps={dragHandleProps} />}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outlined" startIcon={<AddIcon />} onClick={addItem} fullWidth>
        항목 추가
      </Button>
    </Stack>
  );
}

export default BudgetItemList;
