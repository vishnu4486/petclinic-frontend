import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(30, "Name cannot exceed 30 characters")
  .regex(/^\p{L}+(?:[ '-]\p{L}+)*$/u, "Name must contain valid letters");

export const ownerSchema = z.object({
  firstName: nameSchema,

  lastName: nameSchema,

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(255, "Address cannot exceed 255 characters"),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(80, "City cannot exceed 80 characters"),

  telephone: z
    .string()
    .trim()
    .min(1, "Telephone is required")
    .max(20, "Telephone cannot exceed 20 digits")
    .regex(/^[0-9]+$/, "Telephone must contain only numbers"),
});

export type OwnerFormValues = z.infer<typeof ownerSchema>;
