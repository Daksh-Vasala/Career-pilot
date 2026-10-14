import { z } from "zod";

const optionalText = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === "" ? null : value),
    schema.nullable().optional(),
  );

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .optional(),

    phoneNumber: optionalText(
      z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, "Invalid phone number"),
    ),

    linkedinUrl: optionalText(
      z.string().trim().url({ error: "Invalid LinkedIn URL" }),
    ),

    githubUrl: optionalText(
      z.string().trim().url({ error: "Invalid GitHub URL" }),
    ),

    portfolioUrl: optionalText(
      z.string().trim().url({ error: "Invalid portfolio URL" }),
    ),

    location: optionalText(
      z.string().trim().max(150, "Location must not exceed 150 characters"),
    ),

    bio: optionalText(
      z.string().trim().max(1000, "Bio must not exceed 1000 characters"),
    ),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });
