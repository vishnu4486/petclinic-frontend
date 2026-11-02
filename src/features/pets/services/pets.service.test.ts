import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../../../services/apiClient";
import { petsService, type PetSaveRequest } from "./pets.service";

vi.mock("../../../services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

const mockPet = {
  id: 10,
  name: "Bruno",
  birthDate: "2020-05-15",
  type: {
    id: 1,
    name: "Dog",
  },
  visits: [],
};

const petPayload: PetSaveRequest = {
  name: "Bruno",
  birthDate: "2020-05-15",
  type: {
    id: 1,
    name: "Dog",
  },
};

describe("petsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches pet details using owner ID and pet ID", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: mockPet,
    });

    const result = await petsService.getById(1, 10);

    expect(apiClient.get).toHaveBeenCalledWith("/owners/1/pets/10");

    expect(result).toEqual(mockPet);
  });

  it("creates a pet for an existing owner", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: mockPet,
    });

    const result = await petsService.create(1, petPayload);

    expect(apiClient.post).toHaveBeenCalledWith("/owners/1/pets", petPayload);

    expect(result).toEqual(mockPet);
  });

  it("updates an existing pet", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({
      status: 204,
      data: undefined,
    });

    const result = await petsService.update(1, 10, petPayload);

    expect(apiClient.put).toHaveBeenCalledWith("/owners/1/pets/10", petPayload);

    expect(result).toBeUndefined();
  });

  it("propagates errors when fetching pet details", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error("Pet not found"));

    await expect(petsService.getById(1, 999)).rejects.toThrow("Pet not found");
  });

  it("propagates errors when creating a pet", async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new Error("Unable to create pet"),
    );

    await expect(petsService.create(1, petPayload)).rejects.toThrow(
      "Unable to create pet",
    );
  });

  it("propagates errors when updating a pet", async () => {
    vi.mocked(apiClient.put).mockRejectedValue(
      new Error("Unable to update pet"),
    );

    await expect(petsService.update(1, 10, petPayload)).rejects.toThrow(
      "Unable to update pet",
    );
  });
});
