import { z } from "zod";

export const petSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Pet name is required")
    .max(30, "Pet name cannot exceed 30 characters"),

  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
      }

      const [year, month, day] = value.split("-").map(Number);

      const date = new Date(`${value}T00:00:00`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    }, "Enter a valid birth date")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date <= today;
    }, "Birth date cannot be in the future"),

  typeId: z
    .number()
    .int("Select a valid pet type")
    .positive("Pet type is required"),
});

export type PetFormValues = z.infer<typeof petSchema>;
