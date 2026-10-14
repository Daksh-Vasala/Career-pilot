
import { redirect } from "next/navigation";

import { getJobsPageDataServer } from "@/lib/server-api";
import { JobsClient } from "@/features/jobs/components/jobs-client";

export default async function JobsPage() {
  let data;

  try {
    data = await getJobsPageDataServer();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }

    throw error;
  }

  return (
    <JobsClient
      initialJobs={data.jobs}
      initialApplications={data.applications}
    />
  );
}
