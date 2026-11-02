import { useEffect, useState } from "react";

import {
  Alert,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppFormDialog } from "../../../components/common/AppFormDialog";

import { petSchema, type PetFormValues } from "../validation/pet.schema";

import type { Pet, PetTypeOption } from "../../../types/pet.types";

// Pet type from Spring PetClinic backend

interface PetFormProps {
  open: boolean;

  // null for Add Pet, existing pet for Edit Pet
  pet?: Pet | null;

  // Available pet types from GET /api/pettypes
  petTypes: PetTypeOption[];

  petTypesLoading?: boolean;

  petTypesError?: string | null;

  onClose: () => void;

  // Return true when API operation succeeds
  onSubmit: (values: PetFormValues) => Promise<boolean>;
}

const defaultValues: PetFormValues = {
  name: "",
  birthDate: "",
  typeId: 0,
};

export function PetForm({
  open,
  pet = null,
  petTypes,
  petTypesLoading = false,
  petTypesError = null,
  onClose,
  onSubmit,
}: PetFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = pet !== null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Reset the form when opening Add/Edit
  useEffect(() => {
    if (!open) {
      return;
    }

    setSubmitError(null);

    if (pet) {
      reset({
        name: pet.name ?? "",
        birthDate: pet.birthDate ? pet.birthDate.substring(0, 10) : "",
        typeId: pet.type?.id ?? 0,
      });
    } else {
      reset(defaultValues);
    }
  }, [open, pet, reset]);

  const submitForm = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const success = await onSubmit(values);

      if (success) {
        onClose();
      } else {
        setSubmitError("Unable to save pet. Please try again.");
      }
    } catch {
      setSubmitError("Something went wrong while saving the pet.");
    }
  });

  return (
    <AppFormDialog
      open={open}
      title={isEditMode ? "Edit Pet" : "Add Pet"}
      onClose={onClose}
      onSubmit={() => {
        void submitForm();
      }}
      submitLabel={isEditMode ? "Update Pet" : "Save Pet"}
      submitting={isSubmitting}
    >
      <Stack spacing={2} sx={{ mt: 1 }}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {petTypesError && <Alert severity="error">{petTypesError}</Alert>}

        {/* Pet Name */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Pet Name"
              fullWidth
              required
              autoFocus
              disabled={isSubmitting}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Birth Date */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Birth Date"
              type="date"
              fullWidth
              required
              disabled={isSubmitting}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  max: new Date().toLocaleDateString("en-CA"),
                },
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Pet Type Dropdown */}
        <Controller
          name="typeId"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              select
              label="Pet Type"
              fullWidth
              required
              value={field.value || ""}
              onChange={(event) => {
                field.onChange(Number(event.target.value));
              }}
              onBlur={field.onBlur}
              inputRef={field.ref}
              disabled={isSubmitting || petTypesLoading || !!petTypesError}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            >
              {petTypesLoading ? (
                <MenuItem disabled value="">
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                  Loading pet types...
                </MenuItem>
              ) : petTypes.length === 0 ? (
                <MenuItem disabled value="">
                  No pet types available
                </MenuItem>
              ) : (
                petTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        />
      </Stack>
    </AppFormDialog>
  );
}
