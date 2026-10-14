import { redirect } from "next/navigation";

import { getApplicationsPageDataServer } from "@/lib/server-api";
import { ApplicationsClient } from "@/features/applications/components/applications-client";

export default async function ApplicationsPage() {
  let data;

  try {
    data = await getApplicationsPageDataServer();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }

    throw error;
  }

  return (
    <ApplicationsClient
      initialApplications={data.applications}
      initialJobs={data.jobs}
    />
  );
}
