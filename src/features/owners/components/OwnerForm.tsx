import { useEffect } from "react";
import { Alert, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppFormDialog } from "../../../components/common/AppFormDialog";

import { ownerSchema, type OwnerFormValues } from "../validation/owner.schema";

import type { Owner } from "../../../types/owner.types";

interface OwnerFormProps {
  open: boolean;
  owner?: Owner | null;
  onClose: () => void;
  onSubmit: (values: OwnerFormValues) => Promise<boolean>;
}

const defaultValues: OwnerFormValues = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  telephone: "",
};

const fields = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "telephone", label: "Telephone" },
] as const;

export function OwnerForm({ open, owner, onClose, onSubmit }: OwnerFormProps) {
  const isEditMode = Boolean(owner);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!open) return;

    reset(
      owner
        ? {
            firstName: owner.firstName,
            lastName: owner.lastName,
            address: owner.address,
            city: owner.city,
            telephone: owner.telephone,
          }
        : defaultValues,
    );
  }, [open, owner, reset]);

  const submitForm = handleSubmit(async (values) => {
    try {
      const success = await onSubmit(values);

      if (success) {
        onClose();
      } else {
        setError("root", {
          message:
            "Unable to save owner. Please check the details and try again.",
        });
      }
    } catch {
      setError("root", {
        message: "Something went wrong while saving the owner.",
      });
    }
  });

  return (
    <AppFormDialog
      open={open}
      title={isEditMode ? "Edit Owner" : "Add Owner"}
      submitLabel={isEditMode ? "Update Owner" : "Save Owner"}
      onClose={onClose}
      onSubmit={() => {
        void submitForm();
      }}
      submitting={isSubmitting}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}

        {fields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                required
                size="small"
                disabled={isSubmitting}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                slotProps={
                  name === "telephone"
                    ? {
                        htmlInput: {
                          inputMode: "numeric",
                          maxLength: 20,
                        },
                      }
                    : undefined
                }
              />
            )}
          />
        ))}
      </Stack>
    </AppFormDialog>
  );
}
