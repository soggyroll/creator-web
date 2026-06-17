/** @format */

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  CalendarIcon,
  CheckIcon,
  CoinsIcon,
  ShieldIcon,
  UsersIcon,
  XCircleIcon,
  LogOutIcon,
} from "lucide-react";

import { useInviteInfo } from "@/hooks/use-invite-info";
import { useAcceptInvite } from "@/hooks/use-accept-invite";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default function InvitePage({ params }: InvitePageProps) {
  const { token } = use(params);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const { data: invite, isLoading, isError } = useInviteInfo(token);
  const { mutate: accept, isPending: accepting } = useAcceptInvite();

  const isExpired = invite ? new Date(invite.expires_at) < new Date() : false;
  const isRevoked = invite?.status === "revoked";
  const isInvalid = isExpired || isRevoked;

  function handleAccept() {
    accept(token, {
      onSuccess: () => {
        toast.success(`You've joined ${invite?.team_name}!`);
        router.push("/generate");
      },
      onError: () => {
        toast.error(
          "Couldn't accept the invite. It may have already expired or been revoked.",
        );
      },
    });
  }

  function handleSignIn() {
    router.push(`/sign-in?redirect_url=/invite/${token}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header */}
      <header className="border-b px-6 py-4">
        <span className="text-sm font-semibold tracking-tight">
          Comfy Creators
        </span>
      </header>

      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-border p-8">
          {/* Loading */}
          {isLoading || !isLoaded ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="mx-auto size-16 rounded-full" />
              <Skeleton className="mx-auto h-6 w-48" />
              <Skeleton className="mx-auto h-4 w-32" />
              <Skeleton className="mt-4 h-px w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-10 w-full rounded-lg" />
            </div>
          ) : isError || !invite ? (
            /* Error / invalid token */
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                <XCircleIcon className="size-7 text-destructive" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  This invite link is invalid
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  It may have expired, already reached its usage limit, or been
                  revoked by the team admin.
                </p>
              </div>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go home
              </Button>
            </div>
          ) : isInvalid ? (
            /* Expired or revoked */
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <XCircleIcon className="size-7 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  {isRevoked ? "Invite revoked" : "Invite expired"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isRevoked
                    ? "This invite link has been revoked by the team admin."
                    : "This invite link has expired. Ask the team admin to send you a new one."}
                </p>
              </div>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go home
              </Button>
            </div>
          ) : (
            /* Valid invite */
            <div className="flex flex-col gap-6">
              {/* Team avatar + name */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {invite.team_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    You&apos;ve been invited to join
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    {invite.team_name}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Invited by{" "}
                    <span className="font-medium text-foreground">
                      {invite.inviter_name}
                    </span>
                  </p>
                </div>

                {/* Expiry */}
                <Badge variant="secondary" className="gap-1.5">
                  <CalendarIcon className="size-3" />
                  Expires{" "}
                  {new Date(invite.expires_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>
              </div>

              <div className="border-t" />

              {/* What joining means */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  What joining means
                </p>
                <ul className="flex flex-col gap-2.5">
                  <li className="flex items-start gap-2.5 text-sm">
                    <UsersIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      You&apos;ll get access to{" "}
                      <span className="font-medium">{invite.team_name}</span>
                      &apos;s shared workflows and generation history.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CoinsIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      Your generation costs will be charged to{" "}
                      <span className="font-medium">{invite.team_name}</span>
                      &apos;s credit balance — not your personal account.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <ShieldIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      Team owners and admins can see your activity, change your
                      role, or remove you at any time.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <LogOutIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>You can leave the team at any time from settings.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t" />

              {/* CTA */}
              {isSignedIn ? (
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full"
                    onClick={handleAccept}
                    disabled={accepting}
                  >
                    {accepting ? (
                      "Joining…"
                    ) : (
                      <>
                        <CheckIcon className="size-4" />
                        Join {invite.team_name}
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    You&apos;ll be added as a Member.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button className="w-full" onClick={handleSignIn}>
                    Sign in to join {invite.team_name}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    You&apos;ll be redirected back here after signing in.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
