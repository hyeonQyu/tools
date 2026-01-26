import { GetResolvedFunction } from '@/lib/resolvable.types';

export const r: GetResolvedFunction = (resolvable) => {
  if (resolvable instanceof Function) {
    return resolvable;
  }
  return (..._) => resolvable;
};
