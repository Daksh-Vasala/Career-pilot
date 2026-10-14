"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  CalendarDays,
  Building2,
  ListFilter,
} from "lucide-react";

import type {
  Application,
  ApplicationStatus,
} from "@/features/applications/application.types";
import type { Job } from "@/features/jobs/job.types";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ApplicationsClientProps {
  initialApplications: Application[];
  initialJobs: Job[];
}

const statusOptions = [
  { label: "All statuses", value: "ALL" },
  { label: "Applied", value: "APPLIED" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Offer", value: "OFFER" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
] as const;

const statusStyles: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  INTERVIEW: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  OFFER: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ACCEPTED: "bg-green-500/10 text-green-600 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  WITHDRAWN: "bg-muted text-muted-foreground border-border",
};

function formatDate(date: string | null) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationsClient({
  initialApplications,
  initialJobs,
}: ApplicationsClientProps) {
  const [applications] = useState<Application[]>(initialApplications);
  const [jobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );

  const jobsById = useMemo(() => {
    return new Map(jobs.map((job) => [job.id, job]));
  }, [jobs]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const job = jobsById.get(application.jobId);
      const company = job?.companyName ?? "";
      const jobTitle = job?.jobTitle ?? "";

      const matchesSearch =
        !query ||
        company.toLowerCase().includes(query) ||
        jobTitle.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, jobsById, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: applications.length,
      interviews: applications.filter(
        (application) => application.status === "INTERVIEW",
      ).length,
      offers: applications.filter(
        (application) =>
          application.status === "OFFER" || application.status === "ACCEPTED",
      ).length,
      rejected: applications.filter(
        (application) => application.status === "REJECTED",
      ).length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your job applications.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Applications"
          value={counts.total}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          description="Applications tracked"
        />

        <SummaryCard
          title="Interviews"
          value={counts.interviews}
          icon={<CalendarDays className="h-5 w-5" />}
          description="Interview stage"
        />

        <SummaryCard
          title="Offers"
          value={counts.offers}
          icon={<Building2 className="h-5 w-5" />}
          description="Offers and accepted"
        />

        <SummaryCard
          title="Rejected"
          value={counts.rejected}
          icon={<ListFilter className="h-5 w-5" />}
          description="Unsuccessful applications"
        />
      </div>

      {/* Search and filter */}
      <div className="surface-raised p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by company or job title..."
              aria-label="Search applications"
              className="surface-inset h-10 w-full pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ApplicationStatus | "ALL")
            }
            aria-label="Filter applications by status"
            className="surface-inset h-10 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Application list */}
      <div className="surface-raised overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Your applications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filteredApplications.length}{" "}
            {filteredApplications.length === 1 ? "application" : "applications"}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <BriefcaseBusiness className="h-7 w-7 text-muted-foreground" />
            </div>

            <h3 className="font-semibold">No applications yet</h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Applications you track from the Jobs page will appear here.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">No matching applications</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredApplications.map((application) => {
              const job = jobsById.get(application.jobId);
              const title = job?.jobTitle || "Untitled position";
              const company = job?.companyName || "—";
              const location = job?.location || "";

              return (
                <div
                  key={application.id}
                  className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-muted p-2.5">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{title}</h3>

                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {company}
                      </p>

                      {location && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {location}
                        </p>
                      )}

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Applied: {formatDate(application.appliedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        statusStyles[application.status]
                      }`}
                    >
                      {application.status.charAt(0) +
                        application.status.slice(1).toLowerCase()}
                    </span>
                    <Link
                      href={`/applications/${application.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      View details
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="surface-raised p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        <div className="rounded-lg bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
