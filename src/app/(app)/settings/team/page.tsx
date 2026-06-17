/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useTeam } from "@/hooks/team/use-team";
import { useTeamMembers } from "@/hooks/team/use-team-members";
import { usePatchTeam } from "@/hooks/team/use-patch-team";
import { useArchiveTeam } from "@/hooks/team/use-archive-team";
import { useLeaveTeam } from "@/hooks/team/use-leave-team";
import { useAddTeamMember } from "@/hooks/team/use-add-team-member";
import { useRemoveTeamMember } from "@/hooks/team/use-remove-team-member";
import { useUpdateMemberRole } from "@/hooks/team/use-update-member-role";
import { TEAMS_QUERY_KEY } from "@/hooks/team/use-teams";
import { CURRENT_TEAM_QUERY_KEY } from "@/hooks/team/use-team";
import { setTeamCookie } from "@/actions/team";
import type {
  TeamMemberView,
  TeamRole,
  TeamWithMembership,
} from "@/types/api/teams";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { formatDate } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractErrorMessage(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; message?: string }>;
  return (
    axiosErr?.response?.data?.error ??
    axiosErr?.response?.data?.message ??
    "Something went wrong"
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TeamSettingsPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { team, teamId } = useTeam();
  const { data: members, isLoading: membersLoading } = useTeamMembers(teamId);

  // ── General section state ──────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingGeneral, setEditingGeneral] = useState(false);

  const { mutate: patchTeam, isPending: patching } = usePatchTeam(teamId ?? "");
  const { mutate: archiveTeam, isPending: archiving } = useArchiveTeam(
    teamId ?? "",
  );
  const { mutate: leaveTeam, isPending: leaving } = useLeaveTeam(teamId ?? "");

  // ── Members section state ─────────────────────────────────────────────────
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("MEMBER");
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const { mutate: addMember, isPending: addingMember } = useAddTeamMember(
    teamId ?? "",
  );
  const { mutate: removeMember, isPending: removingMember } =
    useRemoveTeamMember(teamId ?? "");
  const { mutate: updateRole } = useUpdateMemberRole(teamId ?? "");

  // ── Derived ───────────────────────────────────────────────────────────────
  const myRole = team?.role;
  const canEdit = myRole === "OWNER" || myRole === "ADMIN";
  const isOwner = myRole === "OWNER";

  const activeMembers = members?.filter((m) => m.status === "ACTIVE") ?? [];
  const owners = activeMembers.filter((m) => m.role === "OWNER");
  const isLastOwner = owners.length === 1 && owners[0]?.user_id === userId;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function startEditing() {
    setName(team?.name ?? "");
    setSlug(team?.slug ?? "");
    setEditingGeneral(true);
  }

  function handleSaveGeneral() {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    patchTeam(
      { name: name.trim(), slug: slug.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Team updated");
          setEditingGeneral(false);
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  }

  async function handlePostLeaveOrArchive() {
    const teams =
      queryClient.getQueryData<TeamWithMembership[]>(TEAMS_QUERY_KEY) ?? [];
    const remaining = teams.filter((t) => t.id !== teamId);
    if (remaining.length > 0) {
      await setTeamCookie(remaining[0].id);
      queryClient.setQueryData(CURRENT_TEAM_QUERY_KEY, remaining[0].id);
    }
    queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    router.push("/discover");
  }

  function handleLeave() {
    if (isLastOwner) return;
    leaveTeam(undefined, {
      onSuccess: handlePostLeaveOrArchive,
      onError: (err) => {
        toast.error(extractErrorMessage(err));
        setLeaveDialogOpen(false);
      },
    });
  }

  function handleArchive() {
    archiveTeam(undefined, {
      onSuccess: () => {
        setArchiveDialogOpen(false);
        handlePostLeaveOrArchive();
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
        setArchiveDialogOpen(false);
      },
    });
  }

  function handleAddMember() {
    if (!newUserId.trim()) {
      toast.error("User ID is required");
      return;
    }
    addMember(
      { user_id: newUserId.trim(), role: newRole },
      {
        onSuccess: () => {
          toast.success("Member added");
          setNewUserId("");
          setNewRole("MEMBER");
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  }

  function handleRemoveMember(member: TeamMemberView) {
    const memberOwners = activeMembers.filter((m) => m.role === "OWNER");
    if (member.role === "OWNER" && memberOwners.length === 1) {
      toast.error("Cannot remove the last owner");
      return;
    }
    removeMember(member.user_id, {
      onSuccess: () => toast.success("Member removed"),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  }

  function handleRoleChange(member: TeamMemberView, role: TeamRole) {
    const memberOwners = activeMembers.filter((m) => m.role === "OWNER");
    if (
      member.role === "OWNER" &&
      memberOwners.length === 1 &&
      role !== "OWNER"
    ) {
      toast.error("Cannot demote the last owner");
      return;
    }
    updateRole(
      { userId: member.user_id, role },
      {
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (!team) {
    return (
      <div className="mx-auto w-full max-w-3xl py-10 px-6 flex flex-col gap-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-3xl py-10 px-6 flex flex-col gap-10">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage {team.name}&apos;s info, and members.
        </p>
      </div>

      {/* ── General ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            General
          </h2>
          {canEdit && !editingGeneral && (
            <Button size="sm" variant="outline" onClick={startEditing}>
              Edit
            </Button>
          )}
        </div>

        {editingGeneral ? (
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="team-name">Name</FieldLabel>
              <Input
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Team"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="team-slug">Slug</FieldLabel>
              <Input
                id="team-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-team"
              />
            </Field>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSaveGeneral} disabled={patching}>
                {patching ? "Saving…" : "Save changes"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingGeneral(false)}
                disabled={patching}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Name</p>
              <p className="font-medium">{team.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Slug</p>
              <p className="font-medium">{team.slug ?? "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Your role</p>
              <p className="font-medium">{myRole?.toLowerCase()}</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Members ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border p-6 flex flex-col gap-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Members
        </h2>

        {membersLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMembers.map((member) => {
                const isSelf = member.user_id === userId;
                const isThisLastOwner =
                  member.role === "OWNER" && owners.length === 1;
                const canChangeRole =
                  canEdit && !isSelf && (isOwner || member.role !== "OWNER");
                const canRemove = canEdit && !isSelf && !isThisLastOwner;

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        {member.user_avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.user_avatar_url}
                            alt={member.user_name}
                            className="size-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-muted-foreground">
                              {member.user_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-none truncate">
                            {member.user_name}
                            {isSelf && (
                              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {member.user_email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {canChangeRole ? (
                        <Select
                          value={member.role}
                          onValueChange={(v) =>
                            handleRoleChange(member, v as TeamRole)
                          }
                        >
                          <SelectTrigger size="sm" className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {isOwner && (
                              <SelectItem value="OWNER">Owner</SelectItem>
                            )}
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MEMBER">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p>{member.role.toLocaleLowerCase()}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {member.joined_at ? formatDate(member.joined_at) : "—"}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        {canRemove && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            disabled={removingMember}
                            onClick={() => handleRemoveMember(member)}
                          >
                            Remove
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Add member form */}
        {canEdit && (
          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground">
              Add member
            </p>
            <div className="flex items-end gap-2">
              <Field className="flex-1">
                <FieldLabel htmlFor="new-user-id">User ID</FieldLabel>
                <Input
                  id="new-user-id"
                  placeholder="user_…"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
              </Field>
              <Field className="w-32">
                <FieldLabel htmlFor="new-role">Role</FieldLabel>
                <Select
                  value={newRole}
                  onValueChange={(v) => setNewRole(v as TeamRole)}
                >
                  <SelectTrigger id="new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isOwner && <SelectItem value="OWNER">Owner</SelectItem>}
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button
                onClick={handleAddMember}
                disabled={addingMember || !newUserId.trim()}
              >
                {addingMember ? "Adding…" : "Add"}
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* ── Danger zone ──────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-destructive/30 p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-destructive/70">
          Danger zone
        </h2>

        {/* Leave team */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Leave team</p>
            <p className="text-xs text-muted-foreground">
              {isLastOwner
                ? "Transfer ownership to another member before leaving."
                : "You will immediately lose access to this team."}
            </p>
          </div>

          {isLastOwner ? (
            <Button size="sm" variant="outline" disabled>
              Leave team
            </Button>
          ) : (
            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Leave team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leave {team.name}?</DialogTitle>
                  <DialogDescription>
                    You will immediately lose access to this team and its
                    workflows. You can be re-added by an owner.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setLeaveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLeave}
                    disabled={leaving}
                  >
                    {leaving ? "Leaving…" : "Leave team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Archive team — OWNER only, blocked for personal teams */}
        {isOwner && (
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-destructive/20">
            <div>
              <p className="text-sm font-medium">Archive team</p>
              <p className="text-xs text-muted-foreground">
                {team.is_personal
                  ? "Personal teams cannot be archived."
                  : "Deactivates the team. Members will lose access immediately."}
              </p>
            </div>

            {team.is_personal ? (
              <Button size="sm" variant="destructive" disabled>
                Archive team
              </Button>
            ) : (
              <Dialog
                open={archiveDialogOpen}
                onOpenChange={setArchiveDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    Archive team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Archive {team.name}?</DialogTitle>
                    <DialogDescription>
                      This will deactivate the team and revoke access for all
                      members. Are you sure you want to continue?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setArchiveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleArchive}
                      disabled={archiving}
                    >
                      {archiving ? "Archiving…" : "Archive team"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
