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
  jobDescription: z.string().trim().max(20000).optional(),
});

export const atsReadinessSchema = z.object({
  score: z.number().int().min(0).max(100),
  explanation: z.string().trim().min(1),
  suggestions: z.array(z.string().trim().min(1)).min(1).max(5),
});

export type AtsReadinessData = z.infer<typeof atsReadinessSchema>;

export const resumeAnalysisIdSchema = z.object({
  id: z.uuid("Invalid resume analysis ID"),
});

export const resumeIdQuerySchema = z.object({
  resumeId: z.uuid("Invalid resume ID"),
});

export type ResumeAnalysisData = z.infer<typeof resumeAnalysisSchema>;
