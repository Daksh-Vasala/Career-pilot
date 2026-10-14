import { Response } from "express";
import { AuthRequest } from "../../types/express.types.ts";
import { getProfileService, updateProfileService } from "./profile.service.ts";
import { ApiError } from "../../utils/api-error.ts";

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const data = await getProfileService(req.userId);

  if (!data) {
    throw new ApiError(500, "Failed to fetch the profile data");
  }

  return res.status(200).json({
    success: true,
    message: "Profile data fetched successfully",
    data,
  });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const updatedProfile = await updateProfileService(userId, req.body);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedProfile,
  });
};
