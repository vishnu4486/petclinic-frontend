import { apiClient } from "../../../services/apiClient";

import type { VisitFormValues } from "../validation/visit.schema";

// Payload sent to Spring PetClinic REST API
export interface CreateVisitRequest {
  date: string;
  description: string;
}

// Visit response from the backend
export interface VisitResponse {
  id: number;
  date: string;
  description: string;
}

export const visitsService = {
  // Register a new visit for a selected pet
  async create(
    ownerId: number,
    petId: number,
    values: VisitFormValues,
  ): Promise<VisitResponse> {
    const payload: CreateVisitRequest = {
      date: values.date,
      description: values.description,
    };

    const response = await apiClient.post<VisitResponse>(
      `/owners/${ownerId}/pets/${petId}/visits`,
      payload,
    );

    return response.data;
  },
};
