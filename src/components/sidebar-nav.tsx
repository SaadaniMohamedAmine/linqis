"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Video, CheckSquare, Plug, BarChart3, Users, Code2, Settings } from "lucide-react";
import { getMyWorkspaces, ACTIVE_WORKSPACE_KEY, type WorkspaceRole } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { sidebarNavDictionary, type SidebarNavDictionary } from "@/lib/i18n/dictionaries/sidebar-nav";

interface NavLink {
  href: string;
  labelKey: keyof SidebarNavDictionary;
  icon: typeof LayoutDashboard;
  dataTour?: string;
}

const LINKS: NavLink[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/meetings", labelKey: "meetings", icon: Video, dataTour: "meetings-nav" },
  { href: "/dashboard/action-items", labelKey: "actionItems", icon: CheckSquare, dataTour: "action-items-nav" },
  { href: "/dashboard/team", labelKey: "team", icon: Users },
  { href: "/dashboard/integrations", labelKey: "integrations", icon: Plug },
  { href: "/dashboard/analytics", labelKey: "analytics", icon: BarChart3 },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
];

// Kept out of LINKS so it can be filtered by role before rendering.
const DEVELOPERS_LINK: NavLink = { href: "/dashboard/developers", labelKey: "developers", icon: Code2 };

export function SidebarNav() {
  const t = useDictionary(sidebarNavDictionary);
  const pathname = usePathname();
  const { data: session } = useSession();
  const [myRole, setMyRole] = useState<WorkspaceRole | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    getMyWorkspaces()
      .then((workspaces) => {
        const activeId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
        const active = workspaces.find((w) => w.id === activeId) || workspaces[0];
        setMyRole(active?.role ?? null);
      })
      .catch(() => setMyRole(null));
  }, [session?.user?.id]);

  const canManage = myRole === "OWNER" || myRole === "ADMIN";
  const links = canManage ? [...LINKS, DEVELOPERS_LINK] : LINKS;

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, labelKey, icon: Icon, dataTour }) => {
        const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            data-tour={dataTour}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              isActive ? "bg-surface text-success" : "text-text-secondary hover:bg-surface/50"
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{t[labelKey]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
