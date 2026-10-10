import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../types/express.types.ts";
import { ApiError } from "../../utils/api-error.ts";

export const validateBody = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;

    next();
  };
};

export const validateParams = (schema: z.ZodType<Request["params"]>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
       return next(
        new ApiError(400, "Invalid parameters"),
      );
    }

    req.params = result.data;
    next();
  };
};

export const validateResumeFile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  next();
};

export const validateQuery = (schema: z.ZodType<Request["query"]>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
       return next(
        new ApiError(400, "Invalid query parameters"),
      );
    }

    next();
  };
};
