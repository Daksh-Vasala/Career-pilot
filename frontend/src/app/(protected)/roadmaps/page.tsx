import { redirect } from "next/navigation";

import { getRoadmapsServer } from "@/lib/server-api";
import { RoadmapsClient } from "@/features/roadmaps/components/roadmaps-client";

export default async function RoadmapsPage() {
  let roadmaps;

  try {
    roadmaps = await getRoadmapsServer();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }

    throw error;
  }

  return <RoadmapsClient initialRoadmaps={roadmaps} />;
}