import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../../../services/apiClient";
import { ownersService } from "./owners.service";

vi.mock("../../../services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockOwner = {
  id: 1,
  firstName: "John",
  lastName: "Smith",
  address: "123 Main Street",
  city: "Pune",
  telephone: "9876543210",
  pets: [],
};

const ownerData = {
  firstName: "John",
  lastName: "Smith",
  address: "123 Main Street",
  city: "Pune",
  telephone: "9876543210",
};

describe("ownersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all owners", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [mockOwner],
    });

    const result = await ownersService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/owners");
    expect(result).toEqual([mockOwner]);
  });

  it("fetches paginated owners with search parameters", async () => {
    const params = {
      lastName: "Smith",
      page: 0,
      size: 20,
    };

    const mockPage = {
      content: [mockOwner],
      totalPages: 1,
      totalElements: 1,
      number: 0,
      size: 20,
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: mockPage,
    });

    const result = await ownersService.getPage(params);

    expect(apiClient.get).toHaveBeenCalledWith("/v2/owners", { params });

    expect(result).toEqual(mockPage);
  });

  it("fetches an owner by ID", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: mockOwner,
    });

    const result = await ownersService.getById(1);

    expect(apiClient.get).toHaveBeenCalledWith("/owners/1");
    expect(result).toEqual(mockOwner);
  });

  it("creates a new owner", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: mockOwner,
    });

    const result = await ownersService.create(ownerData);

    expect(apiClient.post).toHaveBeenCalledWith("/owners", ownerData);

    expect(result).toEqual(mockOwner);
  });

  it("updates an existing owner", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({
      data: mockOwner,
    });

    const result = await ownersService.update(1, ownerData);

    expect(apiClient.put).toHaveBeenCalledWith("/owners/1", ownerData);

    expect(result).toEqual(mockOwner);
  });

  it("deletes an owner", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: undefined,
    });

    await ownersService.remove(1);

    expect(apiClient.delete).toHaveBeenCalledWith("/owners/1");
  });

  it("propagates API errors", async () => {
    const apiError = new Error("Server unavailable");

    vi.mocked(apiClient.get).mockRejectedValue(apiError);

    await expect(ownersService.getAll()).rejects.toThrow("Server unavailable");
  });
});
