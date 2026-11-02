import { z } from "zod";

export const visitSchema = z.object({
  date: z
    .string()
    .min(1, "Visit date is required")
    .refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
      }

      const date = new Date(`${value}T00:00:00Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "Please enter a valid date"),

  description: z
    .string()
    .trim()
    .min(1, "Visit description is required")
    .max(255, "Description cannot exceed 255 characters"),
});

export type VisitFormValues = z.infer<typeof visitSchema>;
