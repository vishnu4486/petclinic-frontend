import { useCallback, useEffect, useState } from "react";

import { petTypesService } from "../services/petTypes.service";
import { normalizeApiError } from "../../../services/apiError";
import type { PetType } from "../../../types/pet.types";

export function usePetTypes() {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPetTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await petTypesService.getAll();

      setPetTypes(data);
    } catch (err: unknown) {
      const apiError = normalizeApiError(err);

      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPetTypes();
  }, [fetchPetTypes]);

  return {
    petTypes,
    petTypesLoading: loading,
    petTypesError: error,
    refreshPetTypes: fetchPetTypes,
  };
}
