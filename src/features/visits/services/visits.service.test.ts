import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../../../services/apiClient";
import { visitsService } from "./visits.service";

import type { VisitFormValues } from "../validation/visit.schema";

vi.mock("../../../services/apiClient", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const visitData: VisitFormValues = {
  date: "2026-01-15",
  description: "Regular health checkup",
};

const mockVisitResponse = {
  id: 101,
  date: "2026-01-15",
  description: "Regular health checkup",
};

describe("visitsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a visit successfully", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: mockVisitResponse,
    });

    const result = await visitsService.create(1, 10, visitData);

    expect(apiClient.post).toHaveBeenCalledWith("/owners/1/pets/10/visits", {
      date: "2026-01-15",
      description: "Regular health checkup",
    });

    expect(result).toEqual(mockVisitResponse);
  });

  it("sends only date and description in the request body", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: mockVisitResponse,
    });

    await visitsService.create(1, 10, visitData);

    const [, payload] = vi.mocked(apiClient.post).mock.calls[0];

    expect(payload).toEqual({
      date: visitData.date,
      description: visitData.description,
    });

    expect(Object.keys(payload as object)).toHaveLength(2);
  });

  it("uses the correct owner ID and pet ID", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: mockVisitResponse,
    });

    await visitsService.create(25, 50, visitData);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/owners/25/pets/50/visits",
      visitData,
    );
  });

  it("returns the created visit response", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: mockVisitResponse,
    });

    const result = await visitsService.create(1, 10, visitData);

    expect(result.id).toBe(101);
    expect(result.date).toBe("2026-01-15");
    expect(result.description).toBe("Regular health checkup");
  });

  it("propagates API errors when visit registration fails", async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new Error("Unable to register visit"),
    );

    await expect(visitsService.create(1, 10, visitData)).rejects.toThrow(
      "Unable to register visit",
    );
  });

  it("does not retry a failed POST automatically", async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new Error("Server unavailable"),
    );

    await expect(visitsService.create(1, 10, visitData)).rejects.toThrow(
      "Server unavailable",
    );

    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });
});
