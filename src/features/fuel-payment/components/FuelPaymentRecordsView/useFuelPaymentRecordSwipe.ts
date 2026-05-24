import { animate, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState, type TouchEvent } from 'react';
import { flushSync } from 'react-dom';

const SWIPE_THRESHOLD_RATIO = 1 / 3;
const DIRECTION_LOCK_PX = 8;
const SNAP_BACK_SPRING = { type: 'spring' as const, stiffness: 400, damping: 40 };

export type FuelPaymentRecordSwipeDirection = 'prev' | 'next';

interface UseFuelPaymentRecordSwipeParams {
  onNavigate: (direction: FuelPaymentRecordSwipeDirection) => void;
}

export const useFuelPaymentRecordSwipe = ({ onNavigate }: UseFuelPaymentRecordSwipeParams) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const swipeAxisRef = useRef<'h' | 'v' | null>(null);
  const isAnimatingRef = useRef(false);
  const [peekPanel, setPeekPanel] = useState<FuelPaymentRecordSwipeDirection | null>(null);
  const peekOffsetRef = useRef(0);
  const peekX = useTransform(x, (value) => value + peekOffsetRef.current);

  const getWidth = () => containerRef.current?.clientWidth ?? 375;

  const openPeekPanel = (direction: FuelPaymentRecordSwipeDirection) => {
    const width = getWidth();
    peekOffsetRef.current = direction === 'prev' ? -width : width;
    setPeekPanel(direction);
  };

  const clearPeekPanel = () => {
    setPeekPanel(null);
  };

  const animateBackToCurrent = () => {
    animate(x, 0, {
      ...SNAP_BACK_SPRING,
      onComplete: clearPeekPanel,
    });
  };

  const commitToAdjacentMonth = (direction: FuelPaymentRecordSwipeDirection, duration: number) => {
    const width = getWidth();
    const targetX = direction === 'next' ? -width : width;

    animate(x, targetX, {
      duration,
      ease: 'easeOut',
      onComplete: () => {
        flushSync(() => {
          onNavigate(direction);
          clearPeekPanel();
        });
        x.set(0);
        isAnimatingRef.current = false;
      },
    });
  };

  const navigateAdjacent = (direction: FuelPaymentRecordSwipeDirection) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    openPeekPanel(direction);
    commitToAdjacentMonth(direction, 0.25);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    swipeAxisRef.current = null;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current) return;

    const diffX = e.touches[0].clientX - touchStartXRef.current;
    const diffY = e.touches[0].clientY - touchStartYRef.current;

    if (!swipeAxisRef.current) {
      if (Math.abs(diffX) < DIRECTION_LOCK_PX && Math.abs(diffY) < DIRECTION_LOCK_PX) return;
      swipeAxisRef.current = Math.abs(diffX) >= Math.abs(diffY) ? 'h' : 'v';
      if (swipeAxisRef.current === 'h') {
        openPeekPanel(diffX > 0 ? 'prev' : 'next');
      }
    }

    if (swipeAxisRef.current === 'h') {
      x.set(diffX);
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const axis = swipeAxisRef.current;
    swipeAxisRef.current = null;

    if (isAnimatingRef.current || axis !== 'h') {
      if (axis !== 'h' && peekPanel) clearPeekPanel();
      return;
    }

    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    const width = getWidth();
    const shouldNavigate = Math.abs(diff) >= width * SWIPE_THRESHOLD_RATIO;

    if (!shouldNavigate) {
      animateBackToCurrent();
      return;
    }

    isAnimatingRef.current = true;
    commitToAdjacentMonth(diff > 0 ? 'next' : 'prev', 0.2);
  };

  const handleTouchCancel = () => {
    swipeAxisRef.current = null;
    if (isAnimatingRef.current) return;
    animateBackToCurrent();
  };

  return {
    containerRef,
    x,
    peekX,
    peekPanel,
    navigateAdjacent,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  };
};
