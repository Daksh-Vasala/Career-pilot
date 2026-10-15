import { z } from "zod";

export const createRoadmapSchema = z.object({
  targetRole: z.string().trim().min(2).max(150),
  currentSkills: z.array(z.string().trim().min(1)).max(50),
  durationWeeks: z.number().int().min(1).max(52),
});

export const updateRoadmapSchema = z.object({
  targetRole: z.string().trim().min(2).max(150).optional(),
  currentSkills: z.array(z.string().trim().min(1)).max(50).optional(),
  durationWeeks: z.number().int().min(1).max(52).optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
}).refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: "At least one field must be provided" },
);

export const updateMilestoneSchema = z.object({
  isCompleted: z.boolean(),
});

export const generatedMilestonesSchema = z
  .array(
    z.object({
      title: z.string().trim().min(2).max(200),
      description: z.string().trim().min(5),
      order: z.number().int().min(1),
      tasks: z
        .array(
          z.object({
            title: z.string().trim().min(2).max(200),
            description: z.string().trim().min(5),
          }),
        )
        .min(1)
        .max(10),
    }),
  )
  .min(1)
  .max(20);

export type GeneratedMilestone = z.infer<
  typeof generatedMilestonesSchema
>[number];
export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type UpdateRoadmapInput = z.infer<typeof updateRoadmapSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;