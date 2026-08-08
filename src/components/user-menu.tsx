"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

// First letter of the first name + first letter of the last name (e.g.
// "Mohamed Saadani" -> "MS"). Falls back to the first two letters of a
// single-word name, then the first letter of the email.
function getInitials(name?: string | null, email?: string | null): string {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (email || "?").charAt(0).toUpperCase();
}

export function UserMenu() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = getInitials(name, email);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="h-9 w-9 shrink-0 rounded-full overflow-hidden border border-border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success"
          aria-label="User menu"
        >
          <Avatar.Root className="flex h-full w-full aspect-square items-center justify-center rounded-full bg-success-bg overflow-hidden">
            <Avatar.Image src={image || undefined} alt={name || email || "User"} className="h-full w-full rounded-full object-cover" />
            <Avatar.Fallback className="text-xs font-semibold text-success">{initials}</Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="w-64 bg-surface border border-border rounded-lg shadow-lg p-1 z-50"
        >
          <div className="px-3 py-2">
            {name && <p className="text-sm font-medium text-text-primary truncate">{name}</p>}
            {email && <p className="text-xs text-text-secondary truncate">{email}</p>}
          </div>
          <DropdownMenu.Separator className="h-px bg-border my-1" />
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer outline-none hover:bg-surface-high data-[highlighted]:bg-surface-high"
            >
              <Settings size={16} />
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-border my-1" />
          <DropdownMenu.Item
            onSelect={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2 text-sm text-danger rounded-md cursor-pointer outline-none hover:bg-danger-bg data-[highlighted]:bg-danger-bg"
          >
            <LogOut size={16} />
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
