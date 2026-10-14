
import { notFound, redirect } from "next/navigation";
import { getApplicationDetailsServer } from "@/lib/server-api";
import { ApplicationDetailsClient } from "@/features/applications/components/application-details-client";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data;

  try {
    data = await getApplicationDetailsServer(id);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }

    if (
      error instanceof Error &&
      (error.message === "JOB_NOT_FOUND" ||
        (error as { response?: { status?: number } }).response?.status === 404)
    ) {
      notFound();
    }

    throw error;
  }

  return (
    <ApplicationDetailsClient
      initialApplication={data.application}
      job={data.job}
    />
  );
}
