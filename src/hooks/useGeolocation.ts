import { TIME_UNIT } from '@/lib';
import { useCallback, useEffect, useState } from 'react';

export interface GeolocationCoords {
  lat: number;
  lng: number;
}

export type GeolocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported';

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: TIME_UNIT.unitOfMs.asSecond * 8,
  maximumAge: TIME_UNIT.unitOfMs.asMinute * 5,
};

/** 현재 위치를 한 번 받아온다. enabled가 true면 마운트 시 자동으로 요청한다. */
export const useGeolocation = (enabled = true) => {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('idle');

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus('granted');
      },
      () => setStatus('denied'),
      GEOLOCATION_OPTIONS,
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;
    request();
  }, [enabled, request]);

  return { coords, status, request };
};
