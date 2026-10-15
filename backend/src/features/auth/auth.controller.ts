import { Request, Response } from "express";
import {
  changePasswordService,
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
} from "./auth.service.ts";
import { generateToken } from "../../lib/jwt.ts";
import { setAuthCookie } from "../../lib/auth-cookie.ts";
import { AuthRequest } from "../../types/express.types.ts";
import { ApiError } from "../../utils/api-error.ts";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await registerService(firstName, lastName, email, password);

  if (!user) {
    throw new ApiError(500, "Failed to register user");
  }

  const token = generateToken(user.id);
  setAuthCookie(res, token);

  return res.status(201).json({
    success: true,
    message: "User Registered successfully",
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await loginService(email, password);

  if (!user) {
    throw new ApiError(500, "Failed to login user");
  }

  const token = generateToken(user.id);
  setAuthCookie(res, token);

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: user,
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new ApiError(401, "No user id");
    }

    const start = performance.now();
    const user = await getMeService(userId);
    console.log(`getMeService: ${(performance.now() - start).toFixed(1)} ms`);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      success: true,
      message: "User retreived  successfull",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfull",
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  await forgotPasswordService(email);

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with that email, you will receive a password reset link shortly.",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  await resetPasswordService(token, newPassword);

  return res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
  });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { currentPassword, newPassword } = req.body;

  const result = await changePasswordService(
    userId,
    currentPassword,
    newPassword,
  );

  return res.status(200).json({
    success: true,
    message: result.message,
  });
};
