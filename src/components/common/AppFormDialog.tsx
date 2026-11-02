import type { ReactNode } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { AppButton } from "./AppButton";

interface AppFormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  children: ReactNode;
}

export function AppFormDialog({
  open,
  title,
  onClose,
  onSubmit,
  submitting = false,
  submitLabel = "Save",
  children,
}: AppFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <AppButton
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </AppButton>

        <AppButton loading={submitting} onClick={onSubmit}>
          {submitLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
