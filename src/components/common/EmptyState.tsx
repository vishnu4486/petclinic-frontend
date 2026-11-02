import type { ReactNode } from "react";

import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title = "No records found",
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 5,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h6">{title}</Typography>

      {description && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}
