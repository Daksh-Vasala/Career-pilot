
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  ClipboardList,
  CalendarDays,
  Settings,
  Sparkles,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/resumes", icon: FileText },
  { label: "Job Tracker", href: "/jobs", icon: BriefcaseBusiness },
  { label: "Applications", href: "/applications", icon: ClipboardList },
  { label: "Interviews", href: "/interviews", icon: CalendarDays },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#DADDD7] bg-[#F0F0EC] p-4 dark:border-[#34413C] dark:bg-[#171D1C]">
      <Link href="/dashboard" className="mb-10 flex items-center gap-2 px-2">
        <span className="text-xl font-semibold tracking-tight text-[#202D30] dark:text-[#E7ECE8]">
          CareerPilot
        </span>
      </Link>

      <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-[#617074] dark:text-[#9BAAA3]">
        Workspace
      </p>

      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#285B57] text-white dark:bg-[#83B5A7] dark:text-[#171D1C]"
                  : "text-[#617074] hover:bg-black/5 hover:text-[#202D30] dark:text-[#B1BDB6] dark:hover:bg-white/5 dark:hover:text-[#E7ECE8]"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-[#DADDD7] p-3 dark:border-[#34413C]">
        <p className="text-sm font-medium text-[#202D30] dark:text-[#E7ECE8]">
          Your next move starts here.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#617074] dark:text-[#9BAAA3]">
          Keep your job search organized and moving forward.
        </p>
      </div>
    </aside>
  );
}
