import type { Visit } from "./visit.types";

export interface PetType {
  id: number;
  name: string;
}

export interface PetFields {
  name: string;
  birthDate: string;
  type: PetType;
}

export interface Pet extends PetFields {
  id: number;
  ownerId?: number;
  visits: Visit[];
}

export type CreatePetRequest = PetFields;
export type UpdatePetRequest = PetFields;
export interface PetTypeOption {
  id: number;
  name: string;
}
