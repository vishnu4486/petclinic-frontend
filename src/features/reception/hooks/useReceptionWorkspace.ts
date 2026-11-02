import { useCallback, useEffect, useRef, useState } from "react";

import { ownersService } from "../../owners/services/owners.service";
import { petsService } from "../../pets/services/pets.service";
import { petTypesService } from "../../pets/services/petTypes.service";
import { visitsService } from "../../visits/services/visits.service";

import { normalizeApiError } from "../../../services/apiError";
import { useNotification } from "../../../hooks/useNotification";

import type { Owner, OwnerFields, OwnerPage } from "../../../types/owner.types";

import type { Pet } from "../../../types/pet.types";
import type { PetFormValues } from "../../pets/validation/pet.schema";
import type { PetSaveRequest } from "../../pets/services/pets.service";
import type { VisitFormValues } from "../../visits/validation/visit.schema";

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
  const [visitSaving, setVisitSaving] = useState(false);

  const [ownerError, setOwnerError] = useState<WorkspaceError | null>(null);

  const [petError, setPetError] = useState<WorkspaceError | null>(null);

  // =========================================
  // 3. Request tracking and references
  // =========================================

  const ownersRequestId = useRef(0);
  const ownerRequestId = useRef(0);
  const petRequestId = useRef(0);

  const selectedOwnerRef = useRef<Owner | null>(null);
  const selectedPetRef = useRef<Pet | null>(null);

  // Prevent overlapping visit registrations.
  const visitSavingRef = useRef(false);

  useEffect(() => {
    selectedOwnerRef.current = selectedOwner;
  }, [selectedOwner]);

  useEffect(() => {
    selectedPetRef.current = selectedPet;
  }, [selectedPet]);

  // =========================================
  // 4. Fetch owners
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
  // 5. Select owner
  // =========================================

  const selectOwner = useCallback(async (ownerId: number): Promise<void> => {
    const requestId = ++ownerRequestId.current;

    // Invalidate pending pet requests.
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
  // 6. Select pet
  // =========================================

  const selectPet = useCallback(async (petId: number): Promise<void> => {
    const ownerId = selectedOwnerRef.current?.id;

    if (ownerId === undefined) {
      return;
    }

    const requestId = ++petRequestId.current;

    // A different pet is being selected.
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
  // 7. Refresh selected owner
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
  // 8. Refresh selected pet
  // =========================================

  const refreshSelectedPet = useCallback(async (): Promise<void> => {
    const ownerId = selectedOwnerRef.current?.id;
    const petId = selectedPetRef.current?.id;

    if (ownerId === undefined || petId === undefined) {
      return;
    }

    const requestId = ++petRequestId.current;

    // Keep existing pet visible during refresh.
    setPetLoading(true);
    setPetError(null);

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

      // Preserve existing pet details on failure.
    } finally {
      if (requestId === petRequestId.current) {
        setPetLoading(false);
      }
    }
  }, []);

  // =========================================
  // 9. Create owner
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
  // 10. Update owner
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
  // 11. Build pet payload
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
  // 12. Create pet
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
  // 13. Update pet
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
  // 14. Register visit — improved
  // =========================================

  const registerVisit = async (values: VisitFormValues): Promise<boolean> => {
    const ownerId = selectedOwnerRef.current?.id;
    const petId = selectedPetRef.current?.id;

    if (ownerId === undefined || petId === undefined) {
      showError("Please select an owner and pet first.");
      return false;
    }

    // Synchronous guard prevents overlapping POSTs.
    if (visitSavingRef.current) {
      return false;
    }

    visitSavingRef.current = true;
    setVisitSaving(true);

    // Phase 1: Create visit.
    try {
      await visitsService.create(ownerId, petId, values);
    } catch (error: unknown) {
      showError(normalizeApiError(error).message);

      visitSavingRef.current = false;
      setVisitSaving(false);

      return false;
    }

    // The POST succeeded. Report success independently
    // of subsequent refresh operations.
    showSuccess("Visit registered successfully.");

    // Phase 2: Refresh displayed data.
    try {
      await Promise.all([refreshSelectedPet(), refreshSelectedOwner()]);
    } finally {
      visitSavingRef.current = false;
      setVisitSaving(false);
    }

    return true;
  };

  // =========================================
  // 15. Return workspace functionality
  // =========================================

  return {
    // Owner search and pagination
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

    // Selected owner and pet
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

    // Saving states
    ownerSaving,
    petSaving,
    visitSaving,

    // Owner operations
    createOwner,
    updateOwner,

    // Pet operations
    createPet,
    updatePet,

    // Visit operation
    registerVisit,
  };
}
