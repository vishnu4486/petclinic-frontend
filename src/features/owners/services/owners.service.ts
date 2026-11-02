import { apiClient } from "../../../services/apiClient";

import type {
  Owner,
  OwnerPage,
  OwnerSearchParams,
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from "../../../types/owner.types";

export const ownersService = {
  async getAll(): Promise<Owner[]> {
    const response = await apiClient.get<Owner[]>("/owners");
    return response.data;
  },

  async getPage(params: OwnerSearchParams = {}): Promise<OwnerPage> {
    const response = await apiClient.get<OwnerPage>("/v2/owners", { params });
    return response.data;
  },

  async getById(id: number): Promise<Owner> {
    const response = await apiClient.get<Owner>(`/owners/${id}`);
    return response.data;
  },

  async create(data: CreateOwnerRequest): Promise<Owner> {
    const response = await apiClient.post<Owner>("/owners", data);
    return response.data;
  },

  async update(id: number, data: UpdateOwnerRequest): Promise<Owner> {
    const response = await apiClient.put<Owner>(`/owners/${id}`, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/owners/${id}`);
  },
};
