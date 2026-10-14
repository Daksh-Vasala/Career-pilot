import { CalendarDays, FileText, BriefcaseBusiness, ChartNoAxesColumn } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <div>
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[#DADDD7] dark:bg-[#26312E]" />
        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-[#DADDD7] dark:bg-[#26312E]" />
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[FileText, BriefcaseBusiness, CalendarDays, ChartNoAxesColumn].map(
          (Icon, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5 dark:border-[#34413C] dark:bg-[#1D2624]"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                <Icon className="size-5 text-[#87918C]" />
              </div>
              <div className="mt-5 h-8 w-16 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
              <div className="mt-3 h-3 w-36 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            </div>
          ),
        )}
      </section>

      {/* Pipeline and next interview */}
      <section className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-6 dark:border-[#34413C] dark:bg-[#1D2624]"
          >
            <div className="h-6 w-44 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="mt-3 h-4 w-56 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
            <div className="mt-7 space-y-5">
              {[0, 1, 2, 3].map((row) => (
                <div key={row}>
                  <div className="mb-2 h-3 w-full animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-[#DADDD7] dark:bg-[#34413C]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Recent applications */}
      <section className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-6 dark:border-[#34413C] dark:bg-[#1D2624]">
        <div className="h-6 w-48 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-[#DADDD7] dark:bg-[#34413C]" />
        <div className="mt-6 space-y-4">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="h-16 animate-pulse rounded-xl bg-[#DADDD7]/60 dark:bg-[#26312E]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}