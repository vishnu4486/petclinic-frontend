import { useState } from "react";

import { Box, Grid, Stack } from "@mui/material";

import { MainLayout } from "../../../components/layout/MainLayout";
import { PageHeader } from "../../../components/common/PageHeader";

import { OwnerSearchPanel } from "../components/OwnerSearchPanel";
import { OwnerDetailsPanel } from "../components/OwnerDetailsPanel";
import { PetDetailsPanel } from "../components/PetDetailsPanel";

import { OwnerForm } from "../../owners/components/OwnerForm";
import { PetForm } from "../../pets/components/PetForm";
import { VisitForm } from "../../visits/components/VisitForm";

import { useReceptionWorkspace } from "../hooks/useReceptionWorkspace";
import { usePetTypes } from "../../pets/hooks/usePetTypes";

import type { OwnerFormValues } from "../../owners/validation/owner.schema";
import type { PetFormValues } from "../../pets/validation/pet.schema";
import type { VisitFormValues } from "../../visits/validation/visit.schema";

type OwnerDialogMode = "add" | "edit" | null;
type PetDialogMode = "add" | "edit" | null;

export function ReceptionDeskPage() {
  const workspace = useReceptionWorkspace();

  const { petTypes, petTypesLoading, petTypesError } = usePetTypes();

  // Dialog states
  const [ownerDialogMode, setOwnerDialogMode] = useState<OwnerDialogMode>(null);

  const [petDialogMode, setPetDialogMode] = useState<PetDialogMode>(null);

  const [visitDialogOpen, setVisitDialogOpen] = useState(false);

  // =====================================
  // Owner actions
  // =====================================

  const handleAddOwner = () => {
    setOwnerDialogMode("add");
  };

  const handleEditOwner = () => {
    if (workspace.selectedOwner?.id === undefined) {
      return;
    }

    setOwnerDialogMode("edit");
  };

  const handleCloseOwnerDialog = () => {
    setOwnerDialogMode(null);
  };

  const handleOwnerSubmit = async (
    values: OwnerFormValues,
  ): Promise<boolean> => {
    if (ownerDialogMode === "add") {
      return workspace.createOwner(values);
    }

    if (ownerDialogMode === "edit") {
      return workspace.updateOwner(values);
    }

    return false;
  };

  // =====================================
  // Pet actions
  // =====================================

  const handleAddPet = () => {
    if (workspace.selectedOwner?.id === undefined) {
      return;
    }

    setPetDialogMode("add");
  };

  const handleEditPet = () => {
    if (
      workspace.selectedOwner?.id === undefined ||
      workspace.selectedPet?.id === undefined
    ) {
      return;
    }

    setPetDialogMode("edit");
  };

  const handleClosePetDialog = () => {
    setPetDialogMode(null);
  };

  const handlePetSubmit = async (values: PetFormValues): Promise<boolean> => {
    if (petDialogMode === "add") {
      return workspace.createPet(values);
    }

    if (petDialogMode === "edit") {
      return workspace.updatePet(values);
    }

    return false;
  };

  // =====================================
  // Visit actions
  // =====================================

  const handleRegisterVisit = () => {
    if (
      workspace.selectedOwner?.id === undefined ||
      workspace.selectedPet?.id === undefined
    ) {
      return;
    }

    setVisitDialogOpen(true);
  };

  const handleCloseVisitDialog = () => {
    setVisitDialogOpen(false);
  };

  const handleVisitSubmit = async (
    values: VisitFormValues,
  ): Promise<boolean> => {
    return workspace.registerVisit(values);
  };

  // =====================================
  // Render
  // =====================================

  return (
    <MainLayout>
      <PageHeader
        title="Reception Desk"
        subtitle="Find owners, manage pets, and register visits."
      />

      <Box>
        <Grid container spacing={3}>
          {/* Left: Owner Search */}
          <Grid size={{ xs: 12, md: 5 }}>
            <OwnerSearchPanel
              search={workspace.search}
              onSearchChange={workspace.changeSearch}
              data={workspace.ownerPage}
              loading={workspace.ownersLoading}
              error={workspace.ownersError}
              page={workspace.page}
              pageSize={workspace.pageSize}
              onPageChange={workspace.changePage}
              onPageSizeChange={workspace.changePageSize}
              onRefresh={workspace.refreshOwners}
              onSelectOwner={workspace.selectOwner}
              selectedOwnerId={workspace.selectedOwner?.id}
              onAddOwner={handleAddOwner}
            />
          </Grid>

          {/* Right: Owner and Pet Details */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <OwnerDetailsPanel
                owner={workspace.selectedOwner}
                loading={workspace.ownerLoading}
                error={workspace.ownerError}
                selectedPetId={workspace.selectedPet?.id}
                onSelectPet={workspace.selectPet}
                onRefresh={() => {
                  void workspace.refreshSelectedOwner();
                }}
                onEditOwner={handleEditOwner}
                onAddPet={handleAddPet}
              />

              <PetDetailsPanel
                pet={workspace.selectedPet}
                loading={workspace.petLoading}
                error={workspace.petError}
                onRefresh={() => {
                  void workspace.refreshSelectedPet();
                }}
                onEditPet={handleEditPet}
                onRegisterVisit={handleRegisterVisit}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Reusable Owner Form */}
      <OwnerForm
        open={ownerDialogMode !== null}
        owner={ownerDialogMode === "edit" ? workspace.selectedOwner : null}
        onClose={handleCloseOwnerDialog}
        onSubmit={handleOwnerSubmit}
      />

      {/* Reusable Pet Form */}
      <PetForm
        open={petDialogMode !== null}
        pet={petDialogMode === "edit" ? workspace.selectedPet : null}
        petTypes={petTypes}
        petTypesLoading={petTypesLoading}
        petTypesError={petTypesError}
        onClose={handleClosePetDialog}
        onSubmit={handlePetSubmit}
      />

      {/* Reusable Register Visit Form */}
      <VisitForm
        open={visitDialogOpen}
        onClose={handleCloseVisitDialog}
        onSubmit={handleVisitSubmit}
      />
    </MainLayout>
  );
}
