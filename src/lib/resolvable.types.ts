import { ReactNode } from 'react';

export type ResolvableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | void
  | symbol
  | bigint
  | Record<string, unknown>
  | unknown[]
  | readonly unknown[]
  | ReactNode;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolvableFunction<TArgs extends any[] = any, TReturns extends ResolvableValue = any> = (...args: TArgs) => TReturns;

export type Resolvable<TFunc extends ResolvableFunction> =
  TFunc extends ResolvableFunction<infer TParam, infer TReturn> ? ResolvableFunction<TParam, TReturn> | TReturn : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetResolvedFunction = <TParams extends any[], TReturn extends ResolvableValue>(
  resolvable: Resolvable<ResolvableFunction<TParams, TReturn>>,
) => ResolvableFunction<TParams, TReturn>;
