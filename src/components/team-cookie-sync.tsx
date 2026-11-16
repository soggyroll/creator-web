"use client";

import type { ReactNode } from "react";
import { useEnsureTeamCookie } from "@/hooks/team/use-ensure-team-cookie";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Keep team-scoped requests behind authentication and cookie initialization. */
export function TeamCookieSync({ children }: { children: ReactNode }) {
  const { team, isReady, isSignedIn, isError, retry } = useEnsureTeamCookie();

  if (isError) {
    return <main id="main-content" className="studio-page">
      <Alert variant="destructive">
        <AlertTitle>We couldn&apos;t initialize your workspace.</AlertTitle>
        <AlertDescription>
          <p>Your team selection could not be loaded or saved. Please try again.</p>
          <Button variant="outline" onClick={() => retry()}>Try again</Button>
        </AlertDescription>
      </Alert>
    </main>;
  }

  if (!isReady) {
    return <main id="main-content" className="studio-page" aria-busy="true">
      <p role="status" className="mb-6 text-sm text-muted-foreground">Preparing your workspace…</p>
      <Skeleton className="mb-5 h-20 w-full max-w-md" />
      <Skeleton className="h-64 w-full" />
    </main>;
  }

  if (isSignedIn && !team) {
    return <main id="main-content" className="studio-page">
      <Alert>
        <AlertTitle>No active workspace found.</AlertTitle>
        <AlertDescription>
          <p>Your account has no active team membership. If you just joined, refresh after your account finishes syncing or contact your team owner.</p>
          <Button variant="outline" onClick={() => retry()}>Refresh teams</Button>
        </AlertDescription>
      </Alert>
    </main>;
  }

  return children;
}
