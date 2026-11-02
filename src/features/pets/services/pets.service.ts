import { apiClient } from "../../../services/apiClient";

import type { Pet } from "../../../types/pet.types";

/**
 * Request payload for creating or updating a pet.
 */
export interface PetSaveRequest {
  name: string;
  birthDate: string;
  type: {
    id: number;
    name: string;
  };
}

/**
 * Pet API service.
 *
 * Axios base URL:
 * http://localhost:9966/petclinic/api
 */
export const petsService = {
  /**
   * Get pet details by owner ID and pet ID.
   */
  async getById(ownerId: number, petId: number): Promise<Pet> {
    const response = await apiClient.get<Pet>(
      `/owners/${ownerId}/pets/${petId}`,
    );

    return response.data;
  },

  /**
   * Create a new pet for an existing owner.
   */
  async create(ownerId: number, payload: PetSaveRequest): Promise<Pet> {
    const response = await apiClient.post<Pet>(
      `/owners/${ownerId}/pets`,
      payload,
    );

    return response.data;
  },

  /**
   * Update an existing pet.
   *
   * Backend may return 204 No Content.
   */
  async update(
    ownerId: number,
    petId: number,
    payload: PetSaveRequest,
  ): Promise<void> {
    await apiClient.put(`/owners/${ownerId}/pets/${petId}`, payload);
  },
};
