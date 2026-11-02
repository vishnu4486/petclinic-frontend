import { Alert, Box } from "@mui/material";

import { AppButton } from "./AppButton";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ my: 2 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <AppButton
              variant="text"
              color="inherit"
              size="small"
              onClick={onRetry}
            >
              Retry
            </AppButton>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Box>
  );
}
