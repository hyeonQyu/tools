import { ReactQueryDevtools as RQDevtools } from '@tanstack/react-query-devtools';
import { ComponentProps } from 'react';

export function ReactQueryDevtools(props: ComponentProps<typeof RQDevtools>) {
  return <RQDevtools {...props} />;
}
