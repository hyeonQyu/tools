import { TIME_UNIT } from '@/lib/time.defines';
import { useEffect } from 'react';

export const useSplashRemove = () => {
  useEffect(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), TIME_UNIT.unitOfMs.asSecond * 0.3);
    }
  }, []);
};
