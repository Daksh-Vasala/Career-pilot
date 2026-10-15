import express from "express";
import { validateBody } from "../middlewares/validate.middleware.ts";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.ts";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "./auth.controller.ts";
import { authenticate } from "../middlewares/auth.middleware.ts";
import { asyncHandler } from "../../utils/async-handler.ts";

const router = express.Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));

router.post("/login", validateBody(loginSchema), asyncHandler(login));

router.get("/me", authenticate, asyncHandler(getMe));

router.post("/logout", authenticate, asyncHandler(logout));

router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  asyncHandler(forgotPassword),
);

router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  asyncHandler(resetPassword),
);

export default router;
