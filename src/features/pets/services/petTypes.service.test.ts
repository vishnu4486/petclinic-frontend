import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../../../services/apiClient";
import { petTypesService } from "./petTypes.service";

vi.mock("../../../services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("petTypesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all pet types", async () => {
    const mockPetTypes = [
      { id: 1, name: "Dog" },
      { id: 2, name: "Cat" },
      { id: 3, name: "Bird" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({
      data: mockPetTypes,
    });

    const result = await petTypesService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/pettypes");
    expect(result).toEqual(mockPetTypes);
    expect(result).toHaveLength(3);
  });

  it("handles an empty pet types response", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [],
    });

    const result = await petTypesService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/pettypes");
    expect(result).toEqual([]);
  });

  it("propagates API errors", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(
      new Error("Unable to fetch pet types"),
    );

    await expect(petTypesService.getAll()).rejects.toThrow(
      "Unable to fetch pet types",
    );
  });
});
