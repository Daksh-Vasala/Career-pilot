import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.ts";
import { asyncHandler } from "../../utils/async-handler.ts";
import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getInterviews,
  updateInterview,
} from "./interview.controller.ts";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.ts";
import {
  createInterviewSchema,
  interviewIdSchema,
  updateInterviewSchema,
} from "./interview.validation.ts";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(getInterviews));

router.get("/:id", validateParams(interviewIdSchema), asyncHandler(getInterviewById));

router.post(
  "/",
  validateBody(createInterviewSchema),
  asyncHandler(createInterview),
);

router.patch(
  "/:id",
  validateParams(interviewIdSchema),
  validateBody(updateInterviewSchema),
  asyncHandler(updateInterview),
);

router.delete(
  "/:id",
  validateParams(interviewIdSchema),
  asyncHandler(deleteInterview),
);

export default router;
