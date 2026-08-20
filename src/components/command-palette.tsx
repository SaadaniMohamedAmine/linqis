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
import { useDictionary } from "@/lib/i18n/locale-context";
import { commandPaletteDictionary } from "@/lib/i18n/dictionaries/command-palette";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
}

export function CommandPalette({ className }: { className?: string }) {
  const t = useDictionary(commandPaletteDictionary);
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
        { id: "dashboard", label: t.goToDashboard, icon: LayoutDashboard, action: go("/dashboard") },
        { id: "meetings", label: t.goToMeetings, icon: Video, action: go("/dashboard/meetings") },
        { id: "action-items", label: t.goToActionItems, icon: CheckSquare, action: go("/dashboard/action-items") },
        { id: "integrations", label: t.goToIntegrations, icon: Plug, action: go("/dashboard/integrations") },
        { id: "analytics", label: t.goToAnalytics, icon: BarChart3, action: go("/dashboard/analytics") },
        { id: "upload", label: t.uploadMeeting, icon: Upload, action: go("/dashboard/upload") },
      ];
    }
    return [
      { id: "home", label: t.goToHome, icon: Home, action: go("/") },
      { id: "features", label: t.goToFeatures, icon: Sparkles, action: go("/#features") },
      { id: "use-cases", label: t.goToUseCases, icon: Layers, action: go("/#use-cases") },
      { id: "security", label: t.goToSecurity, icon: ShieldCheck, action: go("/#security") },
      { id: "pricing", label: t.goToPricing, icon: CreditCard, action: go("/pricing") },
      ...(session
        ? [
            { id: "dashboard", label: t.goToDashboard, icon: LayoutDashboard, action: go("/dashboard") },
            { id: "sign-out", label: t.signOut, icon: LogOut, action: () => { setOpen(false); signOut({ callbackUrl: "/" }); } },
          ]
        : [
            { id: "sign-in", label: t.signIn, icon: LogIn, action: go("/sign-in") },
            { id: "sign-up", label: t.createAccount, icon: UserPlus, action: go("/sign-up") },
          ]),
    ];
  }, [isDashboard, session, t]);

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
          aria-label={t.ariaLabel}
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
          <Dialog.Title className="sr-only">{t.dialogTitle}</Dialog.Title>
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search size={16} className="text-text-muted shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent py-4 text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2">
            {filteredNavCommands.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-3 py-2">{t.navigationLabel}</p>
                {filteredNavCommands.map((item, i) => (
                  <CommandRow key={item.id} item={item} active={i === highlighted} onHover={() => setHighlighted(i)} />
                ))}
              </div>
            )}

            {meetingItems.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-3 py-2">{t.meetingsLabel}</p>
                {meetingResults.map((result, i) => (
                  <MeetingResultRow
                    key={result.id}
                    result={result}
                    active={filteredNavCommands.length + i === highlighted}
                    onHover={() => setHighlighted(filteredNavCommands.length + i)}
                    onClick={meetingItems[i].action}
                  />
                ))}
              </div>
            )}

            {flatItems.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">{t.noResults}</p>
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

// The backend wraps matched terms in <b>...</b> (Postgres ts_headline). Parsed
// into JSX <mark> spans instead of dangerouslySetInnerHTML so the rest of the
// snippet (real transcript/summary text, not sanitized upstream) is rendered
// as plain text and auto-escaped by React rather than as raw HTML.
function renderSnippet(snippet: string) {
  return snippet.split(/(<b>.*?<\/b>)/g).map((part, i) => {
    const match = part.match(/^<b>(.*)<\/b>$/);
    if (!match) return part || null;
    return (
      <mark key={i} className="bg-success/20 text-success rounded px-0.5">
        {match[1]}
      </mark>
    );
  });
}

function MeetingResultRow({
  result,
  active,
  onHover,
  onClick,
}: {
  result: SearchResult;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-colors ${
        active ? "bg-success/10 text-success" : "text-text-primary hover:bg-background"
      }`}
    >
      <Video size={16} className="mt-0.5 shrink-0" />
      <span className="min-w-0">
        <span className="block truncate">{result.title}</span>
        {result.snippet && (
          <span className="block truncate text-xs text-text-secondary">{renderSnippet(result.snippet)}</span>
        )}
      </span>
    </button>
  );
}
