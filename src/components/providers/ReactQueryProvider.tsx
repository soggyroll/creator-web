"use client";

import { useState, type ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

function SessionQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
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
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  return <SessionQueryProvider key={userId ?? "signed-out"}>{children}</SessionQueryProvider>;
}
