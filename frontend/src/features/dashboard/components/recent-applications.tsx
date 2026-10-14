import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

import { getRecentApplicationsServer } from "@/lib/server-api";

type RecentApplication = Awaited<
  ReturnType<typeof getRecentApplicationsServer>
>[number];

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

const statusStyles: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  INTERVIEW:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  OFFER:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  ACCEPTED: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  WITHDRAWN: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export async function RecentApplications({
  applications,
}: RecentApplicationsProps) {
  return (
    <section
      className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-6
        shadow-[5px_5px_12px_rgba(32,45,48,0.04),-5px_-5px_12px_rgba(255,255,255,0.6)]
        dark:border-[#34413C] dark:bg-[#1D2624] dark:shadow-none"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#202D30] dark:text-[#E7ECE8]">
            Recent applications
          </h2>
          <p className="mt-1 text-sm text-[#617074] dark:text-[#9BAAA3]">
            Keep track of your latest opportunities.
          </p>
        </div>

        <Link
          href="/applications"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium
            text-[#285B57] hover:underline dark:text-[#A9D4C5]"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 py-6 text-center">
          <BriefcaseBusiness size={28} className="mx-auto text-[#87918C]" />
          <p className="mt-3 font-medium text-[#202D30] dark:text-[#E7ECE8]">
            No applications yet
          </p>
          <p className="mt-1 text-sm text-[#617074] dark:text-[#9BAAA3]">
            Start tracking applications to see them here.
          </p>
          <Link
            href="/jobs"
            className="mt-4 inline-flex rounded-xl bg-[#285B57] px-4 py-2
              text-sm font-medium text-white hover:opacity-90
              dark:bg-[#83B5A7] dark:text-[#171D1C]"
          >
            Explore tracked jobs
          </Link>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-[#DADDD7] dark:divide-[#34413C]">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl
                    bg-[#DCE8DF] text-[#285B57] dark:bg-[#2B4038] dark:text-[#A9D4C5]"
                >
                  <BriefcaseBusiness size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#202D30] dark:text-[#E7ECE8]">
                    {application.job?.jobTitle ?? "Job details unavailable"}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-[#617074] dark:text-[#9BAAA3]">
                    {application.job?.companyName ?? "Unknown company"}
                    {application.job?.location
                      ? ` · ${application.job.location}`
                      : ""}
                  </p>
                  <p className="mt-1 text-xs text-[#87918C]">
                    {application.appliedAt
                      ? `Applied ${formatDate(application.appliedAt)}`
                      : `Added ${formatDate(application.createdAt)}`}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  statusStyles[application.status] ?? statusStyles.APPLIED
                }`}
              >
                {formatStatus(application.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
