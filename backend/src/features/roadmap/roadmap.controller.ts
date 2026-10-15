import { Response } from "express";
import { AuthRequest } from "../../types/express.types.ts";
import { ApiError } from "../../utils/api-error.ts";
import {
  createRoadmapService,
  getRoadmapsService,
  getRoadmapByIdService,
  updateRoadmapService,
  updateMilestoneProgressService,
  generateRoadmapService,
  deleteRoadmapService,
} from "./roadmap.service.ts";
import {
  createRoadmapSchema,
  updateRoadmapSchema,
  updateMilestoneSchema,
} from "./roadmap.validation.ts";

export const createRoadmap = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const parsed = createRoadmapSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid roadmap data");
  }

  const roadmap = await createRoadmapService(userId, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Roadmap created successfully",
    data: roadmap,
  });
};

export const getRoadmaps = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const roadmaps = await getRoadmapsService(userId);

  return res.status(200).json({
    success: true,
    message: "Roadmaps fetched successfully",
    data: roadmaps,
  });
};

export const getRoadmapById = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const roadmapId = String(req.params.id);

  const roadmap = await getRoadmapByIdService(userId, roadmapId);

  return res.status(200).json({
    success: true,
    message: "Roadmap fetched successfully",
    data: roadmap,
  });
};

export const updateRoadmap = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const roadmapId = String(req.params.id);
  const parsed = updateRoadmapSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid roadmap update data");
  }

  const roadmap = await updateRoadmapService(userId, roadmapId, parsed.data);

  return res.status(200).json({
    success: true,
    message: "Roadmap updated successfully",
    data: roadmap,
  });
};

export const updateMilestoneProgress = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.userId!;
  const roadmapId = String(req.params.id);
  const milestoneId = String(req.params.milestoneId);
  const parsed = updateMilestoneSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid milestone progress data");
  }

  const milestone = await updateMilestoneProgressService(
    userId,
    roadmapId,
    milestoneId,
    parsed.data.isCompleted,
  );

  return res.status(200).json({
    success: true,
    message: "Milestone progress updated successfully",
    data: milestone,
  });
};

export const generateRoadmap = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const roadmapId = String(req.params.id);

  const milestones = await generateRoadmapService(userId, roadmapId);

  return res.status(200).json({
    success: true,
    message: "Roadmap milestones generated successfully",
    data: milestones,
  });
};

export async function deleteRoadmap(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  const deletedRoadmap = await deleteRoadmapService(String(id), userId);

  return res.status(200).json({
    success: true,
    message: "Roadmap deleted successfully",
    data: deletedRoadmap,
  });
}
