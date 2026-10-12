import { Response } from "express";
import { AuthRequest } from "../../types/express.types.ts";
import { getDashboardSummaryService } from "./dashboard.service.ts";
import { success } from "zod";

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const summary = await getDashboardSummaryService(userId);

  return res.status(200).json({
    success: true,
    message: "Dashboard summary fetched successfully",
    data: summary,
  });
};
