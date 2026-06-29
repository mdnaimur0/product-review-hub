import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password should be at least 8 characters.")
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password should contain at least one uppercase letter.",
  })
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: "Password should contain at least one special character.",
  });

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: passwordSchema,
  email: z.email({ message: "Invalid email address" }),
});

export const loginSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
  username: z.string().min(1, { message: "Username is required" }),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().max(1000).optional(),
});
