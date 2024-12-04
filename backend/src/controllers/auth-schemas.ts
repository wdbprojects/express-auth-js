import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email().min(1, { message: "Email is required" }).max(255),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(30, { message: "Password must be at most 30 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(30, { message: "Password must be at most 30 characters" }),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }).max(255),
  password: z.string().min(1, { message: "Password is a required field" }),
  userAgent: z.string().optional(),
});
