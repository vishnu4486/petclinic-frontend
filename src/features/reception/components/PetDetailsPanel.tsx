import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";

import type { Pet } from "../../../types/pet.types";
import type { ApiError } from "../../../types/api.types";

interface PetDetailsPanelProps {
  pet: Pet | null;
  loading: boolean;
  error: ApiError | null;
  onRefresh: () => void;
  onEditPet: () => void;
  onRegisterVisit: () => void;
}

export function PetDetailsPanel({
  pet,
  loading,
  error,
  onRefresh,
  onEditPet,
  onRegisterVisit,
}: PetDetailsPanelProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          >
            <Typography variant="h6">Pet Details</Typography>

            {pet && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={onRefresh}
                  disabled={loading}
                >
                  Refresh
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={onEditPet}
                  disabled={loading}
                >
                  Edit Pet
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onRegisterVisit}
                  disabled={loading}
                >
                  Register Visit
                </Button>
              </Stack>
            )}
          </Stack>

          {loading && <LoadingState message="Loading pet details..." />}

          {error && <ErrorState message={error.message} onRetry={onRefresh} />}

          {!pet && !loading && !error && (
            <Typography color="text.secondary">
              Select a pet to view its details and visit history.
            </Typography>
          )}

          {pet && (
            <>
              <Divider />

              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {pet.name}
                </Typography>

                <Typography variant="body2">
                  <strong>Pet Type:</strong> {pet.type?.name ?? "Unknown"}
                </Typography>

                <Typography variant="body2">
                  <strong>Birth Date:</strong> {pet.birthDate}
                </Typography>
              </Stack>

              <Divider />

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Visit History ({pet.visits?.length ?? 0})
              </Typography>

              {!pet.visits?.length ? (
                <Typography color="text.secondary">
                  No visits registered for this pet.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {pet.visits.map((visit, index) => (
                    <Box
                      key={visit.id ?? index}
                      sx={{
                        p: 1.5,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {visit.date}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {visit.description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
