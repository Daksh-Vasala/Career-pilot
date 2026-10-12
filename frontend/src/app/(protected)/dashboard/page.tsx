import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mb-8">
        <p className="text-sm font-medium text-[#285B57] dark:text-[#83B5A7]">
          YOUR WORKSPACE
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#202D30] dark:text-[#E7ECE8]">
          Dashboard
        </h1>
        <p className="mt-2 text-[#617074] dark:text-[#9BAAA3]">
          Your career journey, all in one place.
        </p>
      </div>
    </DashboardShell>
  );
}
