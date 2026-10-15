import { api } from "@/lib/api-client";
import type {
  RoadmapDetails,
  RoadmapMilestone,
  RoadmapMilestonesResponse,
  RoadmapDetailsResponse,
} from "@/features/roadmaps/roadmap.types";

interface RoadmapMilestoneResponse {
  success: boolean;
  message: string;
  data: RoadmapMilestone;
}

export async function generateRoadmap(
  roadmapId: string,
): Promise<RoadmapMilestone[]> {
  const response = await api.post<RoadmapMilestonesResponse>(
    `/roadmaps/${roadmapId}/generate`,
  );

  return response.data.data;
}

export async function updateMilestoneCompletion(
  roadmapId: string,
  milestoneId: string,
  isCompleted: boolean,
): Promise<RoadmapMilestone> {
  const response = await api.patch<RoadmapMilestoneResponse>(
    `/roadmaps/${roadmapId}/milestones/${milestoneId}`,
    { isCompleted },
  );

  return response.data.data;
}

export async function getRoadmapDetails(
  roadmapId: string,
): Promise<RoadmapDetails> {
  const response = await api.get<RoadmapDetailsResponse>(
    `/roadmaps/${roadmapId}`,
  );

  return response.data.data;
}

export async function deleteRoadmap(roadmapId: string): Promise<void> {
  await api.delete(`/roadmaps/${roadmapId}`);
}