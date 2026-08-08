"use client";

import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { ACTIVE_WORKSPACE_KEY, getMyWorkspaces, setActiveWorkspaceId, type Workspace } from "@/lib/api";

export function WorkspaceSwitcher() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    getMyWorkspaces()
      .then((ws) => {
        setWorkspaces(ws);
        const stored = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
        // A stored id that's no longer valid (removed from the workspace)
        // must not stick around, hence the fallback chain.
        const initial = ws.find((w) => w.id === stored) || ws.find((w) => w.role === "OWNER") || ws[0];
        if (initial) {
          setActiveId(initial.id);
          setActiveWorkspaceId(initial.id);
        }
      })
      .catch(() => setWorkspaces([]));
  }, []);

  // Nothing to switch between when there's only one workspace -- don't show
  // a picker with a single option.
  if (workspaces.length <= 1) return null;

  const active = workspaces.find((w) => w.id === activeId);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Switch workspace"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-border text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors cursor-pointer text-sm"
        >
          {active?.name || "Workspace"}
          <ChevronDown size={12} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="w-56 bg-surface border border-border rounded-lg shadow-lg p-1 z-50"
        >
          {workspaces.map((ws) => (
            <DropdownMenu.Item
              key={ws.id}
              onSelect={() => {
                if (ws.id === activeId) return;
                setActiveId(ws.id);
                setActiveWorkspaceId(ws.id);
                // Full reload rather than a router push: every piece of
                // dashboard state (server-rendered sidebar included) is
                // scoped to the active workspace.
                window.location.href = "/dashboard";
              }}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none data-[highlighted]:bg-background text-text-primary"
            >
              <span>
                {ws.name} <span className="text-text-secondary text-xs">· {ws.role.toLowerCase()}</span>
              </span>
              {ws.id === activeId && <Check size={14} className="text-success" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
