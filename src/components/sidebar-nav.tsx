"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Video, CheckSquare, Plug, BarChart3, Users } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/meetings", label: "Meetings", icon: Video, dataTour: "meetings-nav" },
  { href: "/dashboard/action-items", label: "Action Items", icon: CheckSquare, dataTour: "action-items-nav" },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon, dataTour }) => {
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
            <span className="font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
