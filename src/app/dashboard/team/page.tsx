"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Users, UserPlus, Crown, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ApiError,
  getMyWorkspaces,
  getWorkspaceMembers,
  inviteToWorkspace,
  removeWorkspaceMember,
  ACTIVE_WORKSPACE_KEY,
  type WorkspaceMember,
  type WorkspaceRole,
} from "@/lib/api";

const INVITE_ROLES: ("MEMBER" | "ADMIN")[] = ["MEMBER", "ADMIN"];

const ROLE_HINTS: Record<WorkspaceRole, string> = {
  OWNER: "Full access, including billing and members.",
  ADMIN: "Manages members. No access to billing.",
  MEMBER: "Uploads, reads and exports meetings.",
};

const ROLE_BADGE: Record<WorkspaceRole, { variant: "success" | "info" | "neutral"; icon: typeof Crown }> = {
  OWNER: { variant: "success", icon: Crown },
  ADMIN: { variant: "info", icon: ShieldCheck },
  MEMBER: { variant: "neutral", icon: UserIcon },
};

export default function TeamPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [myRole, setMyRole] = useState<WorkspaceRole | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  const load = useCallback(async () => {
    const [list, workspaces] = await Promise.all([getWorkspaceMembers(), getMyWorkspaces()]);
    setMembers(list);

    const activeId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
    const active = workspaces.find((w) => w.id === activeId) || workspaces[0];
    setWorkspaceName(active?.name || "");
    setMyRole(active?.role ?? null);
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    load()
      .catch(() => setError("Could not load your team."))
      .finally(() => setLoading(false));
  }, [session?.user?.id, load]);

  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSentTo("");
    if (!email.trim()) return;

    setInviting(true);
    try {
      await inviteToWorkspace(email.trim(), role);
      setSentTo(email.trim());
      setEmail("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send the invitation.");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (member: WorkspaceMember) => {
    setError("");
    setSentTo("");
    try {
      await removeWorkspaceMember(member.userId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove this member.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-40%] left-[10%] w-[400px] h-[400px] bg-success/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 py-10 animate-fade-in-up">
          <h1 className="text-3xl font-semibold text-text-primary mb-1">Team</h1>
          <p className="text-text-secondary">
            {workspaceName ? `Everyone with access to ${workspaceName}.` : "Everyone with access to this workspace."}
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto p-8 flex flex-col gap-12">
        {error && <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</p>}

        {/* Members */}
        <section className="flex flex-col gap-4 animate-fade-in-up [animation-delay:150ms]">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-text-secondary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Members</h2>
          </div>

          <Card className="p-0 divide-y divide-border overflow-hidden">
            {loading && <p className="p-6 text-sm text-text-secondary">Loading members…</p>}
            {!loading && members.length === 0 && (
              <p className="p-6 text-sm text-text-secondary">No members yet.</p>
            )}
            {members.map((member) => {
              const roleBadge = ROLE_BADGE[member.role];
              const RoleIcon = roleBadge.icon;
              return (
                <div key={member.id} className="p-5 flex items-center justify-between gap-4 hover:bg-background/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-success-bg border border-border shrink-0 flex items-center justify-center text-success font-semibold">
                      {member.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.user.image}
                          alt={member.user.name || "Member"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (member.user.name || member.user.email || "?").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {member.user.name || member.user.email}
                        {member.userId === session?.user?.id && (
                          <span className="text-text-secondary text-sm"> (you)</span>
                        )}
                      </p>
                      <p className="text-sm text-text-secondary truncate">{member.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <Badge variant={roleBadge.variant} className="gap-1">
                      <RoleIcon size={12} />
                      {member.role}
                    </Badge>
                    {canManage && member.role !== "OWNER" && member.userId !== session?.user?.id && (
                      <Button variant="secondary" size="sm" onClick={() => handleRemove(member)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Invite -- owners and admins only; members get no form at all
            rather than one that always 403s. */}
        {canManage && (
          <section className="flex flex-col gap-4 animate-fade-in-up [animation-delay:300ms]">
            <div className="flex items-center gap-2">
              <UserPlus size={16} className="text-text-secondary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Invite a teammate</h2>
            </div>
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-30%] w-48 h-48 bg-success/5 rounded-full blur-3xl" />
              <p className="relative text-sm text-text-secondary mb-6">
                They&apos;ll get an email with a link to join. The invite expires in 7 days.
              </p>
              <form onSubmit={handleInvite} className="relative space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Email address</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="teammate@company.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Role</label>
                  <div className="flex bg-background p-1 rounded-lg border border-border w-fit">
                    {INVITE_ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`px-4 py-1 font-medium rounded-md capitalize cursor-pointer transition-colors ${
                          role === r
                            ? "bg-surface-high text-success shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">{ROLE_HINTS[role]}</p>
                </div>

                <div className="flex items-center justify-end gap-4">
                  {sentTo && <span className="text-sm text-success">Invitation sent to {sentTo} ✓</span>}
                  <Button variant="primary" type="submit" disabled={inviting}>
                    {inviting ? "Sending..." : "Send invitation"}
                  </Button>
                </div>
              </form>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
