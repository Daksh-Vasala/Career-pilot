export type RoadmapStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface RoadmapTask {
  title: string;
  description: string;
}

export interface RoadmapMilestone {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  order: number;
  tasks: RoadmapTask[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Roadmap {
  id: string;
  userId: string;
  targetRole: string;
  currentSkills: string[];
  durationWeeks: number;
  status: RoadmapStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapDetails extends Roadmap {
  milestones: RoadmapMilestone[];
}

export interface RoadmapsResponse {
  success: boolean;
  message: string;
  data: Roadmap[];
}

export interface RoadmapDetailsResponse {
  success: boolean;
  message: string;
  data: RoadmapDetails;
}

export interface RoadmapMilestonesResponse {
  success: boolean;
  message: string;
  data: RoadmapMilestone[];
}