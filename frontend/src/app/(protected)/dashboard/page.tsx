import {
  FileText,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumn,
} from "lucide-react";
import { redirect } from "next/navigation";

import { SummaryCard } from "@/features/dashboard/components/summary-card";
import {
  getDashboardSummaryServer,
  getRecentApplicationsServer,
} from "@/lib/server-api";
import { RecentApplications } from "@/features/dashboard/components/recent-applications";

export default async function DashboardPage() {
  let summary;
  let recentApplications;

  try {
    [summary, recentApplications] = await Promise.all([
      getDashboardSummaryServer(),
      getRecentApplicationsServer(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }

    throw error;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Overview
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your career journey, all in one place.
        </p>
      </div>

      <section
        aria-label="Career summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Resumes"
          value={summary.resumes.total}
          description="Resumes in your library"
          icon={FileText}
        />
        <SummaryCard
          title="Applications"
          value={summary.applications.total}
          description={`${summary.applications.byStatus.APPLIED} applied`}
          icon={BriefcaseBusiness}
        />
        <SummaryCard
          title="Interviews"
          value={summary.interviews.total}
          description={`${summary.interviews.upcoming} upcoming`}
          icon={CalendarDays}
        />
        <SummaryCard
          title="Resume analyses"
          value={summary.resumeAnalyses.total}
          description="Completed analyses"
          icon={ChartNoAxesColumn}
        />
      </section>
      <RecentApplications applications={recentApplications} />
    </div>
  );
}
