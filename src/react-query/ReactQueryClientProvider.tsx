import { ReactQueryDevtools } from '@/react-query/ReactQueryDevtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export interface ReactQueryClientProviderProps {
  children: ReactNode | ReactNode[];
}

function ReactQueryClientProvider(props: ReactQueryClientProviderProps) {
  const { children } = props;

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryClientProvider;
