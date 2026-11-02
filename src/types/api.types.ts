export interface ValidationMessage {
  message: string;
  additionalProperties?: Record<string, unknown>;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  timestamp?: string;
  schemaValidationErrors?: ValidationMessage[];
}

export interface ApiError {
  status: number | null;
  message: string;
  validationErrors: string[];
}
