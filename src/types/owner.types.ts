import type { Pet } from "./pet.types";

export interface OwnerFields {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
}

export interface Owner extends OwnerFields {
  id?: number;
  pets: Pet[];
}

export type CreateOwnerRequest = OwnerFields;
export type UpdateOwnerRequest = OwnerFields;

export interface OwnerPage {
  content: Owner[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface OwnerSearchParams {
  lastName?: string;
  page?: number;
  size?: number;
}
