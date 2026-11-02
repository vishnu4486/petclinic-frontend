import { describe, expect, it } from "vitest";
import { visitSchema } from "./visit.schema";

const validVisit = {
  date: "2026-01-15",
  description: "Regular health checkup",
};

describe("visitSchema", () => {
  it("accepts valid visit details", () => {
    const result = visitSchema.safeParse(validVisit);

    expect(result.success).toBe(true);
  });

  it("rejects an empty visit date", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      date: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid date format", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      date: "15-01-2026",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid calendar date", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      date: "2026-02-30",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid leap year date", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      date: "2024-02-29",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty visit description", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      description: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a description containing only spaces", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      description: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a description of exactly 255 characters", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      description: "A".repeat(255),
    });

    expect(result.success).toBe(true);
  });

  it("rejects a description longer than 255 characters", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      description: "A".repeat(256),
    });

    expect(result.success).toBe(false);
  });

  it("trims surrounding description whitespace", () => {
    const result = visitSchema.safeParse({
      ...validVisit,
      description: "  Regular checkup  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.description).toBe("Regular checkup");
    }
  });
});
