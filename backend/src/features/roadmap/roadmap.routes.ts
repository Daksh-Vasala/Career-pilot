import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.ts";
import { asyncHandler } from "../../utils/async-handler.ts";
import {
  createRoadmap,
  generateRoadmap,
  getRoadmapById,
  getRoadmaps,
  updateMilestoneProgress,
  updateRoadmap,
} from "./roadmap.controller.ts";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.ts";
import {
  createRoadmapSchema,
  updateMilestoneSchema,
  updateRoadmapSchema,
} from "./roadmap.validation.ts";
import { z } from "zod";

const router = Router();

router.use(authenticate);

const roadmapIdParamSchema = z.object({
  id: z.string().uuid(),
});

const milestoneParamsSchema = z.object({
  id: z.string().uuid(),
  milestoneId: z.string().uuid(),
});

router.get("/", asyncHandler(getRoadmaps));

router.post(
  "/",
  validateBody(createRoadmapSchema),
  asyncHandler(createRoadmap),
);

router.get(
  "/:id",
  validateParams(roadmapIdParamSchema),
  asyncHandler(getRoadmapById),
);

router.patch(
  "/:id",
  validateParams(roadmapIdParamSchema),
  validateBody(updateRoadmapSchema),
  asyncHandler(updateRoadmap),
);

router.patch(
  "/:id/milestones/:milestoneId",
  validateParams(milestoneParamsSchema),
  validateBody(updateMilestoneSchema),
  asyncHandler(updateMilestoneProgress),
);

router.post(
  "/:id/generate",
  validateParams(roadmapIdParamSchema),
  asyncHandler(generateRoadmap),
);

export default router;
