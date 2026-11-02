import { createContext, useCallback, useMemo, useState } from "react";

import type { ReactNode } from "react";
import type { AlertColor } from "@mui/material";

import { Alert, Snackbar } from "@mui/material";

export interface NotificationContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

interface NotificationState {
  message: string;
  severity: AlertColor;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const show = useCallback((message: string, severity: AlertColor) => {
    setNotification({ message, severity });
  }, []);

  const showSuccess = useCallback(
    (message: string) => show(message, "success"),
    [show],
  );

  const showError = useCallback(
    (message: string) => show(message, "error"),
    [show],
  );

  const showInfo = useCallback(
    (message: string) => show(message, "info"),
    [show],
  );

  const contextValue = useMemo(
    () => ({
      showSuccess,
      showError,
      showInfo,
    }),
    [showSuccess, showError, showInfo],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      <Snackbar
        open={notification !== null}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {notification ? (
          <Alert
            severity={notification.severity}
            variant="filled"
            onClose={() => setNotification(null)}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotificationContext.Provider>
  );
}
