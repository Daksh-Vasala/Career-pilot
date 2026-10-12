import type { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F0F0EC] dark:bg-[#171D1C]">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
