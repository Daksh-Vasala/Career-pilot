import { z } from "zod";

export const createRoadmapSchema = z.object({
  targetRole: z
    .string()
    .trim()
    .min(2, "Target role must be at least 2 characters")
    .max(150, "Target role cannot exceed 150 characters"),

  currentSkills: z
    .array(z.string().trim().min(1, "Skill cannot be empty"))
    .max(50, "You can add up to 50 skills"),

  durationWeeks: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 week")
    .max(52, "Duration cannot exceed 52 weeks"),
});

export type CreateRoadmapFormValues = z.infer<typeof createRoadmapSchema>;