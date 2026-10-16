"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserRound,
} from "lucide-react";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useAuth } from "@/features/auth/auth-context";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Your account";

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      setLogoutConfirmOpen(false);
      setAccountOpen(false);
      setSidebarOpen(false);
      router.replace("/login");
      router.refresh();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div
      className={`min-h-screen transition-[padding] duration-300 ease-in-out `}
    >
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
      />

      <div
        className={`min-h-screen transition-[padding] duration-300 ease-in-out ${
          collapsed ? "md:pl-18" : "md:pl-68"
        }`}
      >
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between
          border-b border-border bg-background/95 px-4
          shadow-sm backdrop-blur-sm sm:px-6"
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile drawer */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-controls="careerpilot-sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-primary transition-colors
                hover:bg-muted focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu size={21} />
            </button>

            {/* Desktop/tablet collapse */}
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-controls="careerpilot-sidebar"
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
              className="hidden rounded-xl p-2 text-muted-foreground
                transition-colors hover:bg-muted focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            <span className="truncate text-sm font-medium text-muted-foreground">
              Your workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              {accountOpen && (
                <div className="surface-raised absolute right-0 top-full z-40 mt-3
                  w-56 border-border bg-card p-2 shadow-modal">
                  <div className="truncate px-3 py-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {fullName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>

                  <div className="my-1 border-t border-border" />

                  <Link
                    href="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5
                      text-sm text-muted-foreground transition-colors hover:bg-muted
                      hover:text-foreground"
                  >
                    <UserRound size={17} />
                    Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setAccountOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5
                      text-sm text-muted-foreground transition-colors hover:bg-muted
                      hover:text-foreground"
                  >
                    <Settings size={17} />
                    Settings
                  </Link>

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
                onClick={() => setAccountOpen((value) => !value)}
                className="surface-raised flex items-center gap-2 rounded-xl p-2
                  text-left transition-colors hover:bg-muted"
              >
                <span className="flex size-9 shrink-0 items-center justify-center
                  rounded-xl bg-accent text-accent-foreground">
                  <UserRound size={18} />
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-36 truncate text-sm font-medium
                    text-foreground">
                    {fullName}
                  </span>
                  <span className="block max-w-36 truncate text-xs
                    text-muted-foreground">
                    {user?.email}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-5 lg:p-8">{children}</main>
      </div>

      <ConfirmationDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        onConfirm={() => void handleLogout()}
        isPending={loggingOut}
      />
    </div>
  );
}
