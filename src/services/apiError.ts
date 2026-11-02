import axios from "axios";
import type { ApiError, ProblemDetail } from "../types/api.types";

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ProblemDetail>(error)) {
    const status = error.response?.status ?? null;
    const data = error.response?.data;

    const validationErrors =
      data?.schemaValidationErrors?.map((item) => item.message) ?? [];

    let message =
      data?.detail || data?.title || error.message || "Something went wrong.";

    if (!error.response) {
      message =
        "Unable to connect to the server. Please check your connection and try again.";
    }

    return {
      status,
      message,
      validationErrors,
    };
  }

  if (error instanceof Error) {
    return {
      status: null,
      message: error.message,
      validationErrors: [],
    };
  }

  return {
    status: null,
    message: "An unexpected error occurred.",
    validationErrors: [],
  };
}
