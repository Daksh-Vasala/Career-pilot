"use client";

import { useState, type ReactNode } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

          <ModeToggle />
        </header>

        <main className="min-w-0 p-4 sm:p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
