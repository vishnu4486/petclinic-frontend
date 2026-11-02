import axios, { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { normalizeApiError } from "./apiError";

describe("normalizeApiError", () => {
  it("handles an HTTP error response", () => {
    const error = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          title: "Bad Request",
          detail: "Invalid owner information",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      },
    );

    const result = normalizeApiError(error);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid owner information");
    expect(result.validationErrors).toEqual([]);
  });

  it("extracts schema validation errors", () => {
    const error = new AxiosError(
      "Validation failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        data: {
          title: "Validation Error",
          schemaValidationErrors: [
            { message: "First name is required" },
            { message: "Telephone is invalid" },
          ],
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      },
    );

    const result = normalizeApiError(error);

    expect(result.status).toBe(400);
    expect(result.validationErrors).toEqual([
      "First name is required",
      "Telephone is invalid",
    ]);
  });

  it("handles network errors", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");

    const result = normalizeApiError(error);

    expect(result.status).toBeNull();
    expect(result.message).toContain("Unable to connect to the server");
    expect(result.validationErrors).toEqual([]);
  });

  it("handles standard JavaScript errors", () => {
    const result = normalizeApiError(new Error("Unexpected failure"));

    expect(result).toEqual({
      status: null,
      message: "Unexpected failure",
      validationErrors: [],
    });
  });

  it("handles unknown errors", () => {
    const result = normalizeApiError(null);

    expect(result).toEqual({
      status: null,
      message: "An unexpected error occurred.",
      validationErrors: [],
    });
  });
});
