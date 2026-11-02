import { describe, expect, it } from "vitest";
import { ownerSchema } from "./owner.schema";

const validOwner = {
  firstName: "John",
  lastName: "Smith",
  address: "123 Main Street",
  city: "Pune",
  telephone: "9876543210",
};

describe("ownerSchema", () => {
  it("accepts valid owner details", () => {
    const result = ownerSchema.safeParse(validOwner);

    expect(result.success).toBe(true);
  });

  it("rejects an empty first name", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      firstName: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects names containing numbers", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      firstName: "John123",
    });

    expect(result.success).toBe(false);
  });

  it("accepts names with spaces and hyphens", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      firstName: "Anne-Marie",
      lastName: "Mary Jane",
    });

    expect(result.success).toBe(true);
  });

  it("rejects names longer than 30 characters", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      firstName: "A".repeat(31),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty address", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      address: " ",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a city longer than 80 characters", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      city: "A".repeat(81),
    });

    expect(result.success).toBe(false);
  });

  it("rejects telephone numbers containing letters", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      telephone: "98765ABC10",
    });

    expect(result.success).toBe(false);
  });

  it("rejects telephone numbers longer than 20 digits", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      telephone: "1".repeat(21),
    });

    expect(result.success).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const result = ownerSchema.safeParse({
      ...validOwner,
      firstName: " John ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.firstName).toBe("John");
    }
  });
});
