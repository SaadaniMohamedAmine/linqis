"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initial = (name || email || "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="h-9 w-9 rounded-full overflow-hidden border border-border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success"
          aria-label="User menu"
        >
          <Avatar.Root className="flex h-full w-full items-center justify-center bg-success-bg">
            <Avatar.Image src={image || undefined} alt={name || email || "User"} className="h-full w-full object-cover" />
            <Avatar.Fallback className="text-sm font-semibold text-success">{initial}</Avatar.Fallback>
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
