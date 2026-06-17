/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

import { useCreditBalance } from "@/hooks/use-credit-balance";
import { useTeams } from "@/hooks/team/use-teams";
import { useTeam } from "@/hooks/team/use-team";
import { useUpdateTeam } from "@/hooks/team/use-update-team";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navLinks = [
  { label: "Discover", href: "/discover" },
  { label: "Generations", href: "/generations" },
  { label: "Billing", href: "/billing" },
];

function TeamSelect() {
  const { data: teams, isLoading } = useTeams();
  const { teamId } = useTeam();
  const { mutate: updateTeam } = useUpdateTeam();

  if (isLoading) return <Skeleton className="h-8 w-32" />;
  if (!teams?.length) return null;

  return (
    <Select value={teamId ?? undefined} onValueChange={(id) => updateTeam(id)}>
      <SelectTrigger size="sm" className="max-w-fit bg-transparent">
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id!}>
            <span>{team.name}</span>
            {team.role && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {team.role}
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const { data: credits, isLoading } = useCreditBalance();
  const { isLoaded, isSignedIn } = useAuth();
  const { team } = useTeam();

  const hasWorkflowCreation =
    team?.features?.includes("workflow_creation") ?? false;

  return (
    <header className="sticky w-full top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-[10%] flex h-14 items-center gap-6 px-6 justify-between">
        {/* Logo */}
        <Link href="/discover" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/soggyroll.png"
            alt="Soggy Roll"
            width={120 * 2}
            height={33 * 2}
            className="h-10 w-auto"
          />
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          {isLoaded && isSignedIn && (
            <Link
              href="/settings/team"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith("/settings")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Settings
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <>
              <TeamSelect />

              {hasWorkflowCreation ? (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/workflows/new">
                    <PlusIcon className="size-3.5" />
                    Create
                  </Link>
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="pointer-events-none opacity-50"
                        >
                          <PlusIcon className="size-3.5" />
                          Create
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Workflow creation is not enabled for this team
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
                <CreditCardIcon className="size-3 text-muted-foreground" />
                {isLoading ? (
                  <Skeleton className="h-3 w-12" />
                ) : (
                  <span className="text-xs font-medium tabular-nums">
                    {credits?.balance?.toLocaleString() ?? "—"}
                  </span>
                )}
              </div>
              <UserButton />
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
