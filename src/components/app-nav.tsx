"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCardIcon, PlusIcon } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { useCreditBalance } from "@/hooks/use-credit-balance";
import { useTeams } from "@/hooks/team/use-teams";
import { useTeam } from "@/hooks/team/use-team";
import { useUpdateTeam } from "@/hooks/team/use-update-team";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "Generations", href: "/generations" },
  { label: "Billing", href: "/billing" },
];

function TeamSelect() {
  const { data: teams, isLoading } = useTeams();
  const { teamId } = useTeam();
  const { mutate: updateTeam, isPending } = useUpdateTeam();

  if (isLoading) return <Skeleton className="h-9 w-28" />;
  if (!teams?.length) return null;

  return (
    <div className="studio-team-picker">
      <Select disabled={isPending} value={teamId ?? undefined} onValueChange={(id) => updateTeam(id, { onError: () => toast.error("Couldn't switch workspaces. Please try again.") })}>
        <SelectTrigger className="w-full" aria-label="Current team"><SelectValue placeholder="Select team" /></SelectTrigger>
        <SelectContent><SelectGroup>{teams.map((team) => <SelectItem key={team.id} value={team.id!}><span className="truncate">{team.name}</span></SelectItem>)}</SelectGroup></SelectContent>
      </Select>
    </div>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const { data: credits, isLoading } = useCreditBalance();
  const { isLoaded, isSignedIn } = useAuth();
  const { team } = useTeam();
  const hasWorkflowCreation = team?.features?.includes("workflow_creation") ?? false;

  return (
    <header className="studio-app-header">
      <div className="studio-account-bar">
        <Link href="/discover" className="studio-eyebrow">Your creative workspace</Link>
        <div className="studio-account-controls">
          {!isLoaded ? <Skeleton className="h-9 w-36" /> : isSignedIn ? <>
            <TeamSelect />
            <Link href="/billing" className="studio-credit-link" aria-label={`Credit balance: ${credits?.balance?.toLocaleString() ?? "unavailable"}. View billing`}>
              <CreditCardIcon className="size-3.5" aria-hidden="true" />
              {isLoading ? <Skeleton className="h-3 w-10" /> : <span className="tabular-nums">{credits?.balance?.toLocaleString() ?? "—"} cr</span>}
            </Link>
            <UserButton />
          </> : <Button size="sm" asChild><Link href="/sign-in">Sign in</Link></Button>}
        </div>
      </div>
      <nav className="studio-nav" aria-label="Workspace">
        {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="studio-nav-link" aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}
        {isLoaded && isSignedIn && <Link href="/settings/team" className="studio-nav-link" aria-current={pathname.startsWith("/settings") ? "page" : undefined}>Settings</Link>}
        {isLoaded && isSignedIn && hasWorkflowCreation && <Link href="/workflows/new" className="studio-nav-link" aria-current={pathname === "/workflows/new" ? "page" : undefined}><PlusIcon className="size-3.5" aria-hidden="true" />Create workflow</Link>}
      </nav>
    </header>
  );
}
