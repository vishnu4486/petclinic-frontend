import { useEffect, useState } from "react";

import { Alert, Stack, TextField } from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppFormDialog } from "../../../components/common/AppFormDialog";

import { visitSchema, type VisitFormValues } from "../validation/visit.schema";

interface VisitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VisitFormValues) => Promise<boolean>;
}

// Returns today's date in local YYYY-MM-DD format.
function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function VisitForm({ open, onClose, onSubmit }: VisitFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      date: getTodayDate(),
      description: "",
    },
    mode: "onBlur",
  });

  // Reset form whenever the dialog opens.
  useEffect(() => {
    if (open) {
      reset({
        date: getTodayDate(),
        description: "",
      });

      setSubmitError(null);
    }
  }, [open, reset]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    onClose();
  };

  const handleSave = async (values: VisitFormValues): Promise<void> => {
    setSubmitError(null);

    try {
      const success = await onSubmit(values);

      if (success) {
        onClose();
      }
      // If false, the workspace handles the notification.
      // Keep the form open so the user can retry.
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to register visit. Please try again.",
      );
    }
  };

  return (
    <AppFormDialog
      open={open}
      title="Register Visit"
      onClose={handleClose}
      onSubmit={() => {
        void handleSubmit(handleSave)();
      }}
      submitting={isSubmitting}
      submitLabel="Register Visit"
    >
      <Stack spacing={2}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {/* Visit Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Visit Date"
              type="date"
              fullWidth
              required
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}
        />

        {/* Visit Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Visit Description"
              placeholder="Enter visit details"
              fullWidth
              required
              multiline
              rows={4}
              error={Boolean(errors.description)}
              helperText={
                errors.description?.message ?? "Maximum 255 characters"
              }
              slotProps={{
                htmlInput: {
                  maxLength: 255,
                },
              }}
            />
          )}
        />
      </Stack>
    </AppFormDialog>
  );
}
