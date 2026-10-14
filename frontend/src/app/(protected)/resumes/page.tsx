import { redirect } from "next/navigation";

import { getResumesServer } from "@/lib/server-api";
import { ResumesClient } from "@/features/resumes/components/resumes-client";

export default async function ResumesPage() {
  let resumes;

  try {
    resumes = await getResumesServer();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }
    throw error;
  }

  return <ResumesClient initialResumes={resumes} />;
}
