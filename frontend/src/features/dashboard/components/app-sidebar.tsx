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
import { Dialog } from "@base-ui/react/dialog";
import { useAuth } from "@/features/auth/auth-context";

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
        className={`fixed inset-0 z-40 bg-[#17201D]/35 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      />

      <aside
        id="careerpilot-sidebar"
        aria-label="Main sidebar"
        aria-hidden={undefined}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col
          ${collapsed ? "w-68 md:w-18" : "w-68 md:w-68"}
          border-r border-[#DADDD7]/80 bg-[#F0F0EC] p-3
          shadow-[8px_0_28px_rgba(32,45,48,0.10),-3px_0_12px_rgba(255,255,255,0.65)]
          transition-[width,transform] duration-300 ease-in-out
          motion-reduce:transition-none
          dark:border-[#34413C] dark:bg-[#171D1C]
          dark:shadow-[8px_0_28px_rgba(0,0,0,0.3)]
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
            <span className="text-lg font-semibold tracking-tight text-[#285B57] dark:text-[#A9D4C5]">
              {collapsed ? "C" : "CareerPilot"}
            </span>
          </Link>

          {!collapsed && (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-xl p-2 text-[#617074] hover:bg-black/5
                dark:text-[#B1BDB6] dark:hover:bg-white/5 md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#87918C] dark:text-[#9BAAA3]">
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
                  focus-visible:ring-[#285B57] dark:focus-visible:ring-[#83B5A7]
                  ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
                  ${
                    isActive
                      ? "bg-[#E4EAE3] text-[#285B57] shadow-[inset_2px_2px_5px_rgba(40,91,87,0.10),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] dark:bg-[#263631] dark:text-[#A9D4C5] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.18),inset_-1px_-1px_3px_rgba(255,255,255,0.02)]"
                      : "text-[#617074] hover:bg-white/55 hover:text-[#202D30] dark:text-[#B1BDB6] dark:hover:bg-white/4 dark:hover:text-[#E7ECE8]"
                  }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.1 : 1.7} />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Account menu */}
        <div className="relative mt-auto border-t border-[#DADDD7]/80 pt-3 dark:border-[#34413C]">
          {accountOpen && (
            <div
              className={`absolute bottom-full z-10 mb-3 rounded-2xl
                border border-white/80 bg-[#F0F0EC]/95 p-2
                shadow-[6px_6px_18px_rgba(32,45,48,0.10),-4px_-4px_12px_rgba(255,255,255,0.8)]
                backdrop-blur-xl dark:border-[#34413C]
                dark:bg-[#1D2624]/95 dark:shadow-[5px_5px_16px_rgba(0,0,0,0.25)]
                ${collapsed ? "left-full ml-3 w-52" : "inset-x-0"}`}
            >
              <div className="truncate px-3 py-2">
                <p className="truncate text-sm font-medium text-[#202D30] dark:text-[#E7ECE8]">
                  {fullName}
                </p>
                <p className="truncate text-xs text-[#617074] dark:text-[#9BAAA3]">
                  {user?.email}
                </p>
              </div>

              <div className="my-1 border-t border-[#DADDD7] dark:border-[#34413C]" />

              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setLogoutConfirmOpen(true)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5
                  text-sm text-[#9B4545] transition-colors hover:bg-red-500/10
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
            className={`flex w-full items-center rounded-xl border border-white/80
              bg-white/45 p-2.5 text-left
              shadow-[3px_3px_8px_rgba(32,45,48,0.05),-3px_-3px_8px_rgba(255,255,255,0.75)]
              transition-colors hover:bg-white/70
              dark:border-[#34413C] dark:bg-[#1D2624]
              dark:shadow-[3px_3px_8px_rgba(0,0,0,0.15)]
              dark:hover:bg-[#26312E]
              ${collapsed ? "justify-center" : "gap-3"}`}
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-xl
              bg-[#DCE8DF] text-[#285B57] dark:bg-[#2B4038] dark:text-[#A9D4C5]"
            >
              <UserRound size={18} />
            </span>

            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[#202D30] dark:text-[#E7ECE8]">
                    {fullName}
                  </span>
                  <span className="block truncate text-xs text-[#617074] dark:text-[#9BAAA3]">
                    {user?.email}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-[#617074] transition-transform ${
                    !accountOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>
        </div>
      </aside>

      <Dialog.Root
        open={logoutConfirmOpen}
        onOpenChange={(open) => {
          if (!loggingOut) setLogoutConfirmOpen(open);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-60 bg-[#17201D]/45 backdrop-blur-sm" />
          <Dialog.Popup
            className="fixed left-1/2 top-1/2 z-61 w-[calc(100%-2rem)] max-w-md
              -translate-x-1/2 -translate-y-1/2 rounded-2xl border
              border-[#DADDD7] bg-[#F0F0EC] p-6 shadow-2xl
              dark:border-[#34413C] dark:bg-[#1D2624]"
          >
            <Dialog.Title className="text-lg font-semibold text-[#202D30] dark:text-[#E7ECE8]">
              Log out?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[#617074] dark:text-[#B1BDB6]">
              Are you sure you want to log out of your account?
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close
                disabled={loggingOut}
                className="rounded-xl border border-[#DADDD7] px-4 py-2 text-sm
                  font-medium text-[#202D30] transition-colors hover:bg-white/60
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[#285B57] disabled:cursor-not-allowed
                  disabled:opacity-50 dark:border-[#34413C] dark:text-[#E7ECE8]
                  dark:hover:bg-white/5 dark:focus-visible:ring-[#83B5A7]"
              >
                Cancel
              </Dialog.Close>
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="rounded-xl bg-[#9B4545] px-4 py-2 text-sm font-medium
                  text-white transition-colors hover:bg-[#843A3A]
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[#9B4545] focus-visible:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:focus-visible:ring-offset-[#1D2624]"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
