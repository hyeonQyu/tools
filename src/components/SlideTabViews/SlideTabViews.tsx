import { Box, SxProps, Theme } from '@mui/material';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ReactNode, useMemo, useRef } from 'react';

export interface SlideTabViewsItem<T extends string> {
  value: T;
  children: ReactNode;
}

interface SlideTabViewsProps<T extends string> {
  currentValue: T;
  items: SlideTabViewsItem<T>[];
  duration?: number;
  sx?: SxProps<Theme>;
}

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: `${dir * 100}%` }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: `${dir * -100}%` }),
};

function SlideTabViews<T extends string>({ currentValue, items, duration = 0.25, sx }: SlideTabViewsProps<T>) {
  const prevValueRef = useRef<T>(currentValue);
  const directionRef = useRef(0);

  const transition = useMemo(() => ({ duration, ease: 'easeInOut' as const }), [duration]);

  if (prevValueRef.current !== currentValue) {
    const prevIndex = items.findIndex((item) => item.value === prevValueRef.current);
    const nextIndex = items.findIndex((item) => item.value === currentValue);
    directionRef.current = nextIndex - prevIndex;
    prevValueRef.current = currentValue;
  }

  const direction = directionRef.current;
  const activeItem = items.find((item) => item.value === currentValue);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...sx }}>
      <Box sx={{ visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
        {activeItem?.children}
      </Box>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentValue}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {activeItem?.children}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

export default SlideTabViews;
