"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  ClipboardList,
  CalendarDays,
  Settings,
  ChevronDown,
  LogOut,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/resumes", icon: FileText },
  { label: "Job Tracker", href: "/jobs", icon: BriefcaseBusiness },
  { label: "Applications", href: "/applications", icon: ClipboardList },
  { label: "Interviews", href: "/interviews", icon: CalendarDays },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export function AppSidebar({ open, onClose, collapsed }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      setLogoutConfirmOpen(false);
      setAccountOpen(false);
      onClose();
      router.replace("/login");
      router.refresh();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Your account";

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
          transition-[width,transform] duration-300 ease-in-out
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
            <span className="text-lg font-semibold tracking-tight text-primary">
              {collapsed ? "C" : "CareerPilot"}
            </span>
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

        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
        )}

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

        {/* Account menu */}
        <div className="relative mt-auto border-t border-border pt-3">
          {accountOpen && (
            <div
              className={`surface-raised absolute bottom-full z-10 mb-3 p-2
                ${collapsed ? "left-full ml-3 w-52" : "inset-x-0"}`}
            >
              <div className="truncate px-3 py-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {fullName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setLogoutConfirmOpen(true)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5
                  text-sm text-destructive transition-colors hover:bg-destructive/10
                  disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={accountOpen}
            title={collapsed ? fullName : undefined}
            onClick={() => setAccountOpen((value) => !value)}
            className={`surface-raised flex w-full items-center p-2.5 text-left
              transition-colors hover:bg-muted
              ${collapsed ? "justify-center" : "gap-3"}`}
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-xl
              bg-accent text-accent-foreground"
            >
              <UserRound size={18} />
            </span>

            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {fullName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform ${
                    !accountOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>
        </div>
      </aside>

      <ConfirmationDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        onConfirm={() => void handleLogout()}
        isPending={loggingOut}
      />
    </>
  );
}
