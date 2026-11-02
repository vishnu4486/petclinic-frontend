import { apiClient } from "../../../services/apiClient";
import type { PetType } from "../../../types/pet.types";

export const petTypesService = {
  async getAll(): Promise<PetType[]> {
    const response = await apiClient.get<PetType[]>("/pettypes");

    return response.data;
  },
};
