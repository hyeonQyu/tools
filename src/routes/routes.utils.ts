import { AppRouteNode, AppRouteTree } from '@/routes';

export const checkRouteNode = (obj: unknown): obj is AppRouteNode => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_metadata' in obj &&
    typeof (obj as AppRouteNode)._metadata === 'object' &&
    (obj as AppRouteNode)._metadata !== null &&
    'component' in (obj as AppRouteNode)._metadata
  );
};

export const checkNestedRouteTree = (obj: unknown): obj is AppRouteTree => {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) => {
    const v = (obj as Record<string, unknown>)[k];
    return v != null && typeof v === 'object';
  });
};
