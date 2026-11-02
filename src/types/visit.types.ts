export interface VisitFields {
  date?: string;
  description: string;
}

export interface Visit extends VisitFields {
  id: number;
  petId: number;
}

export type CreateVisitRequest = VisitFields;
