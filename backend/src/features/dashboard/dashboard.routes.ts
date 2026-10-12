import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.ts";
import { getDashboardSummary } from "./dashboard.controller.ts";
import { authenticate } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(authenticate);

router.get("/summary", asyncHandler(getDashboardSummary));

export default router;
