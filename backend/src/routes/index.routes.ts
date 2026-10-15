import { Router } from "express";
import authRoutes from "../features/auth/auth.routes.ts";
import profileRoutes from "../features/profile/profile.routes.ts";
import resumeRoutes from "../features/resume/resume.routes.ts";
import jobRoutes from "../features/job/job.routes.ts";
import applicationRoutes from "../features/application/application.routes.ts";
import aiRoutes from "../features/ai/ai.routes.ts";
import interviewRoutes from "../features/interview/interview.routes.ts";
import dashboardRoutes from "../features/dashboard/dashboard.routes.ts";
import roadmapRoutes from "../features/roadmap/roadmap.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/resumes", resumeRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/ai", aiRoutes);
router.use("/interviews", interviewRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/roadmaps", roadmapRoutes);

export default router;
