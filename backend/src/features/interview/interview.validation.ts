import { uuid, z } from "zod";

export const createInterviewSchema = z.object({
  applicationId: z.uuid("Invalid application id"),

  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),

  interviewType: z
    .enum([
      "TECHNICAL",
      "HR",
      "BEHAVIORAL",
      "MANAGERIAL",
      "GROUP_DISCUSSION",
      "OTHER",
    ])
    .optional(),

  scheduledAt: z.iso.datetime().optional(),

  interviewerName: z
    .string()
    .max(150, "Interviewer name must be at most 150 characters")
    .optional(),

  meetingLink: z.url().max(500).optional(),

  notes: z.string().optional(),
  feedback: z.string().optional(),
});

export const updateInterviewSchema = z
  .object({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),

    interviewType: z
      .enum([
        "TECHNICAL",
        "HR",
        "BEHAVIORAL",
        "MANAGERIAL",
        "GROUP_DISCUSSION",
        "OTHER",
      ])
      .nullable()
      .optional(),

    scheduledAt: z.iso.datetime().nullable().optional(),

    interviewerName: z
      .string()
      .max(150, "Interviewer name must be at most 150 characters")
      .nullable()
      .optional(),

    meetingLink: z.url().max(500).nullable().optional(),

    notes: z.string().nullable().optional(),
    feedback: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const interviewIdSchema = z.object({
  id: z.uuid("Invalid interview id"),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
