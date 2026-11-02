import type { ReactNode } from "react";

import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

import PetsIcon from "@mui/icons-material/Pets";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <PetsIcon sx={{ mr: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            PetClinic Reception Desk
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
