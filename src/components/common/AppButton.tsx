import { Button, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export function AppButton({
  loading = false,
  disabled,
  children,
  startIcon,
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      startIcon={
        loading ? <CircularProgress size={16} color="inherit" /> : startIcon
      }
      {...props}
    >
      {children}
    </Button>
  );
}
