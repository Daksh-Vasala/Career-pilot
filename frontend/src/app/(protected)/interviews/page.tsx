import { redirect } from "next/navigation";
import { getInterviewsPageDataServer } from "@/lib/server-api";
import { InterviewsClient } from "@/features/interviews/components/interviews-client";

export default async function InterviewsPage() {
  let data;

  try {
    data = await getInterviewsPageDataServer();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      redirect("/login");
    }

    throw error;
  }

  return (
    <InterviewsClient
      initialInterviews={data.interviews}
      initialApplications={data.applications}
      initialJobs={data.jobs}
    />
  );
}