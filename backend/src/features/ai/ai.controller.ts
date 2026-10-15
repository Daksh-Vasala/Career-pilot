import { Response } from "express";
import { AuthRequest } from "../../types/express.types.ts";
import {
  analyzeResumeService,
  getResumeAnalysesByResumeIdService,
  getResumeAnalysisByIdService,
} from "./ai.service.ts";

export const analyzeResume = async (req: AuthRequest, res: Response) => {
  const { resumeId } = req.body;

  const result = await analyzeResumeService(req.userId!, resumeId);

  res.status(201).json({
    success: true,
    message: "Resume analyzed successfully",
    data: result,
  });
};

export const getResumeAnalysisById = async (
  req: AuthRequest,
  res: Response,
) => {
  const resumeAnalysisId = req.params.id;

  const result = await getResumeAnalysisByIdService(
    String(resumeAnalysisId),
    req.userId!,
  );

  res.status(200).json({
    success: true,
    message: "Resume analysis fetched successfully",
    data: result,
  });
};

export const getResumeAnalysesByResumeId = async (
  req: AuthRequest,
  res: Response,
) => {
  const resumeId = req.query.resumeId;

  const result = await getResumeAnalysesByResumeIdService(
    String(resumeId),
    req.userId!,
  );

  res.status(200).json({
    success: true,
    message: "Resume analyses fetched successfully",
    data: result,
  });
};
