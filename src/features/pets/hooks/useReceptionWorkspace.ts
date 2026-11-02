import { useCallback, useEffect, useRef, useState } from "react";

import { ownersService } from "../../owners/services/owners.service";
import { petsService } from "../../pets/services/pets.service";
import { petTypesService } from "../../pets/services/petTypes.service";

import { normalizeApiError } from "../../../services/apiError";
import { useNotification } from "../../../hooks/useNotification";

import type { Owner, OwnerFields, OwnerPage } from "../../../types/owner.types";

import type { Pet } from "../../../types/pet.types";
import type { PetFormValues } from "../../pets/validation/pet.schema";
import type { PetSaveRequest } from "../../pets/services/pets.service";

// Use the error shape returned by normalizeApiError.
// This avoids depending on a separate ApiError import.
type WorkspaceError = ReturnType<typeof normalizeApiError>;

export function useReceptionWorkspace() {
  const { showSuccess, showError } = useNotification();

  // =========================================
  // 1. Owner search and pagination
  // =========================================

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [ownerPage, setOwnerPage] = useState<OwnerPage | null>(null);

  const [ownersLoading, setOwnersLoading] = useState(false);

  const [ownersError, setOwnersError] = useState<WorkspaceError | null>(null);

  // =========================================
  // 2. Selected owner and pet
  // =========================================

  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [ownerLoading, setOwnerLoading] = useState(false);
  const [petLoading, setPetLoading] = useState(false);

  const [ownerSaving, setOwnerSaving] = useState(false);
  const [petSaving, setPetSaving] = useState(false);

  const [ownerError, setOwnerError] = useState<WorkspaceError | null>(null);

  const [petError, setPetError] = useState<WorkspaceError | null>(null);

  // Prevent older API responses from overwriting newer selections.
  const ownersRequestId = useRef(0);
  const ownerRequestId = useRef(0);
  const petRequestId = useRef(0);

  // Refs hold the current selection for async callbacks.
  const selectedOwnerRef = useRef<Owner | null>(null);
  const selectedPetRef = useRef<Pet | null>(null);

  useEffect(() => {
    selectedOwnerRef.current = selectedOwner;
  }, [selectedOwner]);

  useEffect(() => {
    selectedPetRef.current = selectedPet;
  }, [selectedPet]);

  // =========================================
  // 3. Fetch owners
  // =========================================

  const refreshOwners = useCallback(async (): Promise<void> => {
    const requestId = ++ownersRequestId.current;

    setOwnersLoading(true);
    setOwnersError(null);

    try {
      const result = await ownersService.getPage({
        lastName: search,
        page,
        size: pageSize,
      });

      if (requestId !== ownersRequestId.current) {
        return;
      }

      setOwnerPage(result);
    } catch (error: unknown) {
      if (requestId === ownersRequestId.current) {
        setOwnersError(normalizeApiError(error));
      }
    } finally {
      if (requestId === ownersRequestId.current) {
        setOwnersLoading(false);
      }
    }
  }, [search, page, pageSize]);

  useEffect(() => {
    void refreshOwners();
  }, [refreshOwners]);

  const changeSearch = useCallback((value: string): void => {
    setSearch(value);
    setPage(0);
  }, []);

  const changePage = useCallback((newPage: number): void => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize: number): void => {
    setPageSize(newPageSize);
    setPage(0);
  }, []);

  // =========================================
  // 4. Select owner
  // =========================================

  const selectOwner = useCallback(async (ownerId: number): Promise<void> => {
    const requestId = ++ownerRequestId.current;

    // Invalidate any pending pet request.
    ++petRequestId.current;

    selectedOwnerRef.current = null;
    selectedPetRef.current = null;

    setSelectedOwner(null);
    setSelectedPet(null);

    setOwnerError(null);
    setPetError(null);

    setOwnerLoading(true);
    setPetLoading(false);

    try {
      const owner = await ownersService.getById(ownerId);

      if (requestId !== ownerRequestId.current) {
        return;
      }

      selectedOwnerRef.current = owner;
      setSelectedOwner(owner);
    } catch (error: unknown) {
      if (requestId === ownerRequestId.current) {
        setOwnerError(normalizeApiError(error));
      }
    } finally {
      if (requestId === ownerRequestId.current) {
        setOwnerLoading(false);
      }
    }
  }, []);

  // =========================================
  // 5. Select pet
  // =========================================

  const selectPet = useCallback(async (petId: number): Promise<void> => {
    const ownerId = selectedOwnerRef.current?.id;

    if (ownerId === undefined) {
      return;
    }

    const requestId = ++petRequestId.current;

    selectedPetRef.current = null;
    setSelectedPet(null);

    setPetError(null);
    setPetLoading(true);

    try {
      const pet = await petsService.getById(ownerId, petId);

      if (requestId !== petRequestId.current) {
        return;
      }

      selectedPetRef.current = pet;
      setSelectedPet(pet);
    } catch (error: unknown) {
      if (requestId === petRequestId.current) {
        setPetError(normalizeApiError(error));
      }
    } finally {
      if (requestId === petRequestId.current) {
        setPetLoading(false);
      }
    }
  }, []);

  // =========================================
  // 6. Refresh selected owner
  // =========================================

  const refreshSelectedOwner = useCallback(async (): Promise<void> => {
    const ownerId = selectedOwnerRef.current?.id;

    if (ownerId === undefined) {
      return;
    }

    const requestId = ++ownerRequestId.current;

    setOwnerLoading(true);
    setOwnerError(null);

    try {
      const owner = await ownersService.getById(ownerId);

      if (requestId !== ownerRequestId.current) {
        return;
      }

      selectedOwnerRef.current = owner;
      setSelectedOwner(owner);
    } catch (error: unknown) {
      if (requestId === ownerRequestId.current) {
        setOwnerError(normalizeApiError(error));
      }
    } finally {
      if (requestId === ownerRequestId.current) {
        setOwnerLoading(false);
      }
    }
  }, []);

  // =========================================
  // 7. Refresh selected pet
  // =========================================

  const refreshSelectedPet = useCallback(async (): Promise<void> => {
    const petId = selectedPetRef.current?.id;

    if (petId === undefined) {
      return;
    }

    await selectPet(petId);
  }, [selectPet]);

  // =========================================
  // 8. Create owner
  // =========================================

  const createOwner = async (values: OwnerFields): Promise<boolean> => {
    setOwnerSaving(true);

    try {
      const createdOwner = await ownersService.create(values);

      await refreshOwners();

      if (createdOwner.id !== undefined) {
        await selectOwner(createdOwner.id);
      }

      showSuccess("Owner created successfully.");
      return true;
    } catch (error: unknown) {
      showError(normalizeApiError(error).message);
      return false;
    } finally {
      setOwnerSaving(false);
    }
  };

  // =========================================
  // 9. Update owner
  // =========================================

  const updateOwner = async (values: OwnerFields): Promise<boolean> => {
    const ownerId = selectedOwnerRef.current?.id;

    if (ownerId === undefined) {
      showError("Please select an owner first.");
      return false;
    }

    setOwnerSaving(true);

    try {
      await ownersService.update(ownerId, values);

      await refreshSelectedOwner();
      await refreshOwners();

      showSuccess("Owner updated successfully.");
      return true;
    } catch (error: unknown) {
      showError(normalizeApiError(error).message);
      return false;
    } finally {
      setOwnerSaving(false);
    }
  };

  // =========================================
  // 10. Build pet API payload
  // =========================================

  const buildPetPayload = async (
    values: PetFormValues,
  ): Promise<PetSaveRequest> => {
    const petTypes = await petTypesService.getAll();

    const selectedType = petTypes.find((type) => type.id === values.typeId);

    if (!selectedType) {
      throw new Error("Please select a valid pet type.");
    }

    return {
      name: values.name,
      birthDate: values.birthDate,
      type: {
        id: selectedType.id,
        name: selectedType.name,
      },
    };
  };

  // =========================================
  // 11. Create pet
  // =========================================

  const createPet = async (values: PetFormValues): Promise<boolean> => {
    const ownerId = selectedOwnerRef.current?.id;

    if (ownerId === undefined) {
      showError("Please select an owner first.");
      return false;
    }

    setPetSaving(true);

    try {
      const payload = await buildPetPayload(values);

      const createdPet = await petsService.create(ownerId, payload);

      await refreshSelectedOwner();

      if (createdPet.id !== undefined) {
        await selectPet(createdPet.id);
      }

      showSuccess("Pet created successfully.");
      return true;
    } catch (error: unknown) {
      showError(normalizeApiError(error).message);
      return false;
    } finally {
      setPetSaving(false);
    }
  };

  // =========================================
  // 12. Update pet
  // =========================================

  const updatePet = async (values: PetFormValues): Promise<boolean> => {
    const ownerId = selectedOwnerRef.current?.id;
    const petId = selectedPetRef.current?.id;

    if (ownerId === undefined || petId === undefined) {
      showError("Please select an owner and pet first.");
      return false;
    }

    setPetSaving(true);

    try {
      const payload = await buildPetPayload(values);

      await petsService.update(ownerId, petId, payload);

      await refreshSelectedOwner();
      await refreshSelectedPet();

      showSuccess("Pet updated successfully.");
      return true;
    } catch (error: unknown) {
      showError(normalizeApiError(error).message);
      return false;
    } finally {
      setPetSaving(false);
    }
  };

  // =========================================
  // 13. Public workspace API
  // =========================================

  return {
    // Search and pagination
    search,
    changeSearch,
    ownerPage,
    ownersLoading,
    ownersError,
    page,
    pageSize,
    changePage,
    changePageSize,
    refreshOwners,

    // Selection and details
    selectedOwner,
    selectedPet,
    ownerLoading,
    petLoading,
    ownerError,
    petError,
    selectOwner,
    selectPet,
    refreshSelectedOwner,
    refreshSelectedPet,

    // Save states
    ownerSaving,
    petSaving,

    // Owner operations
    createOwner,
    updateOwner,

    // Pet operations — required by Step 6.7
    createPet,
    updatePet,
  };
}
