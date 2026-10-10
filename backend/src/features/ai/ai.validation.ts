import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(1),
  improvementAreas: z.array(z.string().min(1)).min(1),
  skillsFound: z.array(z.string().min(1)),
  recommendations: z.array(z.string().min(1)).min(1),
});

export const analyzeResumeRequestSchema = z.object({
  resumeId: z.uuid("Invalid resume ID"),
});

export const resumeAnalysisIdSchema = z.object({
  id: z.uuid("Invalid resume analysis ID"),
});

export const resumeIdQuerySchema = z.object({
  resumeId: z.uuid("Invalid resume ID"),
});

export type ResumeAnalysisData = z.infer<typeof resumeAnalysisSchema>;
