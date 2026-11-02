import { describe, expect, it } from "vitest";
import { petSchema } from "./pet.schema";

const validPet = {
  name: "Bruno",
  birthDate: "2020-05-15",
  typeId: 1,
};

describe("petSchema", () => {
  it("accepts valid pet details", () => {
    const result = petSchema.safeParse(validPet);

    expect(result.success).toBe(true);
  });

  it("rejects an empty pet name", () => {
    const result = petSchema.safeParse({
      ...validPet,
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a name containing only spaces", () => {
    const result = petSchema.safeParse({
      ...validPet,
      name: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a pet name longer than 30 characters", () => {
    const result = petSchema.safeParse({
      ...validPet,
      name: "A".repeat(31),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty birth date", () => {
    const result = petSchema.safeParse({
      ...validPet,
      birthDate: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid date format", () => {
    const result = petSchema.safeParse({
      ...validPet,
      birthDate: "15-05-2020",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid calendar date", () => {
    const result = petSchema.safeParse({
      ...validPet,
      birthDate: "2020-02-30",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a future birth date", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day = String(futureDate.getDate()).padStart(2, "0");

    const result = petSchema.safeParse({
      ...validPet,
      birthDate: `${year}-${month}-${day}`,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a zero pet type ID", () => {
    const result = petSchema.safeParse({
      ...validPet,
      typeId: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a negative pet type ID", () => {
    const result = petSchema.safeParse({
      ...validPet,
      typeId: -1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a decimal pet type ID", () => {
    const result = petSchema.safeParse({
      ...validPet,
      typeId: 1.5,
    });

    expect(result.success).toBe(false);
  });
});
