/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry(failureCount, error) {
        if (error instanceof AxiosError) {
          return error.response?.status
            ? error.response.status >= 500 && failureCount < 3
            : failureCount < 3;
        }

        return failureCount < 3;
      },
    },
  },
});

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
