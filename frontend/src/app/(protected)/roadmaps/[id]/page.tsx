import { redirect } from "next/navigation";
import { getRoadmapDetailsServer } from "@/lib/server-api";
import { RoadmapDetailClient } from "@/features/roadmaps/components/roadmap-detail-client";

interface RoadmapPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapPageProps) {
  const { id } = await params;

  try {
    const roadmap = await getRoadmapDetailsServer(id);

    return <RoadmapDetailClient initialRoadmap={roadmap} />;
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      redirect("/login");
    }

    throw error;
  }
}