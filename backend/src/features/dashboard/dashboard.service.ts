import { and, asc, count, eq, gt } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { applications } from "../../db/schema/application.ts";
import { interviews } from "../../db/schema/interview.ts";
import { resumes } from "../../db/schema/resume.ts";
import { resumeAnalyses } from "../../db/schema/resume-analysis.ts";

const applicationStatuses = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const getDashboardSummaryService = async (userId: string) => {
  const currentTime = new Date();

  const [
    applicationsCount,
    [totalInterviews],
    [upcomingInterviews],
    [nextInterview],
    [resumeCount],
    [resumeAnalysesCount],
  ] = await Promise.all([
    db
      .select({
        status: applications.status,
        count: count(),
      })
      .from(applications)
      .where(eq(applications.userId, userId))
      .groupBy(applications.status),

    db
      .select({ total: count() })
      .from(interviews)
      .where(eq(interviews.userId, userId)),

    db
      .select({ total: count() })
      .from(interviews)
      .where(
        and(
          eq(interviews.userId, userId),
          eq(interviews.status, "SCHEDULED"),
          gt(interviews.scheduledAt, currentTime),
        ),
      ),

    db
      .select({
        id: interviews.id,
        scheduledAt: interviews.scheduledAt,
        interviewType: interviews.interviewType,
        interviewerName: interviews.interviewerName,
      })
      .from(interviews)
      .where(
        and(
          eq(interviews.status, "SCHEDULED"),
          eq(interviews.userId, userId),
          gt(interviews.scheduledAt, currentTime),
        ),
      )
      .orderBy(asc(interviews.scheduledAt))
      .limit(1),

    db
      .select({ total: count() })
      .from(resumes)
      .where(eq(resumes.userId, userId)),

    db
      .select({ total: count() })
      .from(resumeAnalyses)
      .where(eq(resumeAnalyses.userId, userId)),
  ]);

  const byStatus = Object.fromEntries(
    applicationStatuses.map((status) => [
      status,
      Number(
        applicationsCount.find((item) => item.status === status)?.count ?? 0,
      ),
    ]),
  );

  const totalApplication = applicationsCount.reduce(
    (total, item) => total + Number(item.count),
    0,
  );

  return {
    resumes: {
      total: Number(resumeCount.total),
    },
    resumeAnalyses: {
      total: Number(resumeAnalysesCount.total),
    },
    applications: {
      total: totalApplication,
      byStatus,
    },
    interviews: {
      total: Number(totalInterviews.total),
      upcoming: Number(upcomingInterviews.total),
      nextInterview: nextInterview ?? null,
    },
  };
};
