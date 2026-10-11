import { Response } from "express";
import { AuthRequest } from "../../types/express.types.ts";
import {
  createInterviewService,
  deleteInterviewService,
  getInterviewByIdService,
  getInterviewsService,
  updateInterviewService,
} from "./interview.service.ts";

export const createInterview = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const interview = await createInterviewService(userId, req.body);

  return res.status(201).json({
    success: true,
    message: "Interview created successfully",
    data: interview,
  });
};

export const updateInterview = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const interviewId = req.params.id;

  const interview = await updateInterviewService(
    userId,
    String(interviewId),
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Interview updated successfully",
    data: interview,
  });
};

export const getInterviews = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const interviews = await getInterviewsService(userId);

  return res.status(200).json({
    success: true,
    message: "Interviews fetched successfully",
    data: interviews,
  });
};

export const getInterviewById = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const interviewId = req.params.id;

  const interview = await getInterviewByIdService(userId, String(interviewId));

  return res.status(200).json({
    success: true,
    message: "Interview fetched successfully",
    data: interview,
  });
};

export const deleteInterview = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const interviewId = req.params.id;

  const interview = await deleteInterviewService(userId, String(interviewId));

  return res.status(200).json({
    success: true,
    message: "Interview deleted successfully",
    data: interview,
  });
};
