import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.ts";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate.middleware.ts";
import {
  analyzeResumeRequestSchema,
  resumeAnalysisIdSchema,
  resumeIdQuerySchema,
} from "./ai.validation.ts";
import { asyncHandler } from "../../utils/async-handler.ts";
import {
  analyzeResume,
  getResumeAnalysesByResumeId,
  getResumeAnalysisById,
} from "./ai.controller.ts";

const router = Router();

router.use(authenticate);

router.post(
  "/resume-analysis",
  validateBody(analyzeResumeRequestSchema),
  asyncHandler(analyzeResume),
);

router.get(
  "/resume-analysis/:id",
  validateParams(resumeAnalysisIdSchema),
  asyncHandler(getResumeAnalysisById),
);

router.get(
  "/resume-analysis",
  validateQuery(resumeIdQuerySchema),
  asyncHandler(getResumeAnalysesByResumeId),
);

export default router;
