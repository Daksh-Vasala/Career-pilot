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
      className="surface-raised p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Recent applications
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of your latest opportunities.
          </p>
        </div>

        <Link
          href="/applications"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium
          text-primary hover:underline"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 py-6 text-center">
          <BriefcaseBusiness size={28} className="mx-auto text-muted-foreground" />
          <p className="mt-3 font-medium text-card-foreground">
            No applications yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start tracking applications to see them here.
          </p>
          <Link
            href="/jobs"
            className="button-primary mt-4 inline-flex px-4 py-2 text-sm font-medium"
          >
            Explore tracked jobs
          </Link>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-border">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl
                    bg-accent text-accent-foreground"
                >
                  <BriefcaseBusiness size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-card-foreground">
                    {application.job?.jobTitle ?? "Job details unavailable"}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {application.job?.companyName ?? "Unknown company"}
                    {application.job?.location
                      ? ` · ${application.job.location}`
                      : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
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
