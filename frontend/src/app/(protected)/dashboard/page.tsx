import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-semibold tracking-tight text-[#202D30] dark:text-[#E7ECE8]">
        Overview
      </h1>
      <p className="mt-2 text-[#617074] dark:text-[#9BAAA3]">
        Your career journey, all in one place.
      </p>
    </DashboardShell>
  );
}
