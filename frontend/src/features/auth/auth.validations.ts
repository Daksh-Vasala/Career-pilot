import { z } from "zod";

export const registerInput = z
  .object({
    firstName: z
      .string()
      .min(2, "First name should be atleast be 2 characters")
      .max(100, "First name should be atmost be 100 characters"),
    lastName: z
      .string()
      .min(2, "Last name should be atleast be 2 characters")
      .max(100, "Last name should be atmost be 100 characters"),
    email: z.email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password should be atleast 8 characters")
      .max(72, "Password should be atmost 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginInput = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password should be atleast 8 characters")
    .max(72, "Password should be atmost 72 characters"),
});
