"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Search,
  Command,
  LayoutDashboard,
  Video,
  CheckSquare,
  Plug,
  BarChart3,
  Upload,
  Home,
  Sparkles,
  Layers,
  ShieldCheck,
  CreditCard,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { searchMeetings, type SearchResult } from "@/lib/api";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
}

export function CommandPalette({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [meetingResults, setMeetingResults] = useState<SearchResult[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setMeetingResults([]);
      setHighlighted(0);
    }
  }, [open]);

  // Meeting/transcript search only makes sense once signed in and on the
  // dashboard -- the endpoint is auth-only and there's nothing to search
  // for a signed-out visitor on the marketing pages.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isDashboard || !session?.user?.id || query.trim().length < 2) {
      setMeetingResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setMeetingResults(await searchMeetings(query));
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, isDashboard, session?.user?.id]);

  const go = (href: string) => () => {
    router.push(href);
    setOpen(false);
  };

  const navCommands: CommandItem[] = useMemo(() => {
    if (isDashboard) {
      return [
        { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, action: go("/dashboard") },
        { id: "meetings", label: "Go to Meetings", icon: Video, action: go("/dashboard/meetings") },
        { id: "action-items", label: "Go to Action Items", icon: CheckSquare, action: go("/dashboard/action-items") },
        { id: "integrations", label: "Go to Integrations", icon: Plug, action: go("/dashboard/integrations") },
        { id: "analytics", label: "Go to Analytics", icon: BarChart3, action: go("/dashboard/analytics") },
        { id: "upload", label: "Upload a meeting", icon: Upload, action: go("/dashboard/upload") },
      ];
    }
    return [
      { id: "home", label: "Go to Home", icon: Home, action: go("/") },
      { id: "features", label: "Go to Features", icon: Sparkles, action: go("/#features") },
      { id: "use-cases", label: "Go to Use Cases", icon: Layers, action: go("/#use-cases") },
      { id: "security", label: "Go to Security", icon: ShieldCheck, action: go("/#security") },
      { id: "pricing", label: "Go to Pricing", icon: CreditCard, action: go("/pricing") },
      ...(session
        ? [
            { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, action: go("/dashboard") },
            { id: "sign-out", label: "Sign Out", icon: LogOut, action: () => { setOpen(false); signOut({ callbackUrl: "/" }); } },
          ]
        : [
            { id: "sign-in", label: "Sign In", icon: LogIn, action: go("/sign-in") },
            { id: "sign-up", label: "Create Account", icon: UserPlus, action: go("/sign-up") },
          ]),
    ];
  }, [isDashboard, session]);

  const filteredNavCommands = query.trim()
    ? navCommands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : navCommands;

  const meetingItems: CommandItem[] = meetingResults.map((r) => ({
    id: r.id,
    label: r.title,
    icon: Video,
    action: go(`/dashboard/meetings/${r.id}`),
  }));

  const flatItems = [...filteredNavCommands, ...meetingItems];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flatItems[highlighted]?.action();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open command palette"
          className={
            className ??
            "flex items-center gap-1 px-2 py-1.5 rounded-md border border-border text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors cursor-pointer"
          }
        >
          <Command size={14} />
          <span className="text-xs font-medium">K</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-[560px] bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search size={16} className="text-text-muted shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent py-4 text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2">
            {filteredNavCommands.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-3 py-2">Navigation</p>
                {filteredNavCommands.map((item, i) => (
                  <CommandRow key={item.id} item={item} active={i === highlighted} onHover={() => setHighlighted(i)} />
                ))}
              </div>
            )}

            {meetingItems.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-3 py-2">Meetings</p>
                {meetingItems.map((item, i) => (
                  <CommandRow
                    key={item.id}
                    item={item}
                    active={filteredNavCommands.length + i === highlighted}
                    onHover={() => setHighlighted(filteredNavCommands.length + i)}
                  />
                ))}
              </div>
            )}

            {flatItems.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">No results.</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CommandRow({ item, active, onHover }: { item: CommandItem; active: boolean; onHover: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={item.action}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-colors ${
        active ? "bg-success/10 text-success" : "text-text-primary hover:bg-background"
      }`}
    >
      <Icon size={16} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}
