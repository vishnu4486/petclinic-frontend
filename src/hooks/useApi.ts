import { useCallback, useEffect, useRef, useState } from "react";

import { normalizeApiError } from "../services/apiError";
import type { ApiError } from "../types/api.types";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  const execute = useCallback(
    async (request: () => Promise<T>): Promise<T | null> => {
      const requestId = ++requestIdRef.current;

      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const result = await request();

        if (mountedRef.current && requestId === requestIdRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }

        return result;
      } catch (error: unknown) {
        const normalizedError = normalizeApiError(error);

        if (mountedRef.current && requestId === requestIdRef.current) {
          setState((previous) => ({
            ...previous,
            loading: false,
            error: normalizedError,
          }));
        }

        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    requestIdRef.current += 1;

    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
