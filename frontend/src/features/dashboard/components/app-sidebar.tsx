"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  ClipboardList,
  CalendarDays,
  X,
  Route,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/resumes", icon: FileText },
  { label: "Job Tracker", href: "/jobs", icon: BriefcaseBusiness },
  { label: "Applications", href: "/applications", icon: ClipboardList },
  { label: "Interviews", href: "/interviews", icon: CalendarDays },
  { label: "AI Roadmap", href: "/roadmaps", icon: Route },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export function AppSidebar({ open, onClose, collapsed }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/30
          transition-opacity duration-300 md:hidden
          ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      />

      <aside
        id="careerpilot-sidebar"
        aria-label="Main sidebar"
        aria-hidden={undefined}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col
          ${collapsed ? "w-68 md:w-18" : "w-68 md:w-68"}
          border-r border-border bg-background p-3
          shadow-sidebar
          transition-transform duration-300 ease-in-out
          md:transition-[width] md:duration-300 md:ease-in-out
          motion-reduce:transition-none
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        {/* Brand */}
        <div
          className={`mb-8 flex h-12 shrink-0 items-center ${
            collapsed ? "justify-center" : "justify-between px-2"
          }`}
        >
          <Link
            href="/dashboard"
            onClick={onClose}
            className="min-w-0"
            aria-label="CareerPilot home"
          >
            <Logo showText={!collapsed} className="text-lg" />
          </Link>

          {!collapsed && (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav aria-label="Workspace navigation" className="flex flex-col gap-1">
          {navigation.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                aria-label={collapsed ? label : undefined}
                title={collapsed ? label : undefined}
                className={`flex min-h-11 items-center rounded-xl py-3
                  text-sm font-medium transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-ring
                  ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-inset-surface"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.1 : 1.7} />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

      </aside>
    </>
  );
}
