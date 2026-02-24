import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';
import { HTMLAttributes, ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  children: ReactNode | ((dragHandleProps: HTMLAttributes<HTMLElement>) => ReactNode);
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      {typeof children === 'function' ? children({ ...attributes, ...listeners, style: { touchAction: 'none' } }) : children}
    </Box>
  );
}

export default SortableItem;
