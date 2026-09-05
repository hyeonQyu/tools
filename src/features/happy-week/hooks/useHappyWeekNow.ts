import { TIME_UNIT } from '@/lib';
import { useEffect, useState } from 'react';

const TICK_MS = TIME_UNIT.unitOfMs.asSecond * 20;

/**
 * "지금". 카운트다운과 NOW 라인이 이 값으로 움직인다.
 *
 * 20초 간격인 이유: 분 단위 카운트다운이 최대 20초 늦게 넘어가는 건 괜찮지만,
 * 마지노선을 앞둔 상황에서 1분 넘게 멈춰 있으면 판단이 틀어진다.
 *
 * 탭이 백그라운드에 있는 동안 브라우저가 타이머를 늦추므로,
 * 화면이 다시 보일 때 즉시 한 번 갱신한다 — 주머니에서 폰을 꺼낸 순간이
 * 이 앱을 가장 많이 쓰는 순간이다.
 */
export const useHappyWeekNow = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());

    const intervalId = window.setInterval(tick, TICK_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') tick();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return now;
};
