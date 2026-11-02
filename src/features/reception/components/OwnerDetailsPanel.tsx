import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";

import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";

import type { Owner } from "../../../types/owner.types";
import type { ApiError } from "../../../types/api.types";

interface OwnerDetailsPanelProps {
  owner: Owner | null;
  loading: boolean;
  error: ApiError | null;
  selectedPetId?: number;
  onSelectPet: (petId: number) => void;
  onRefresh: () => void;
  onEditOwner: () => void;
  onAddPet: () => void;
}

export function OwnerDetailsPanel({
  owner,
  loading,
  error,
  selectedPetId,
  onSelectPet,
  onRefresh,
  onEditOwner,
  onAddPet,
}: OwnerDetailsPanelProps) {
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
            <Typography variant="h6">Owner Details</Typography>

            {owner && (
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
                  onClick={onEditOwner}
                  disabled={loading}
                >
                  Edit Owner
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onAddPet}
                  disabled={loading}
                >
                  Add Pet
                </Button>
              </Stack>
            )}
          </Stack>

          {loading && <LoadingState message="Loading owner details..." />}

          {error && <ErrorState message={error.message} onRetry={onRefresh} />}

          {!owner && !loading && !error && (
            <Typography color="text.secondary">
              Select an owner to view their details.
            </Typography>
          )}

          {owner && (
            <>
              <Divider />

              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {owner.firstName} {owner.lastName}
                </Typography>

                <Typography variant="body2">
                  <strong>Address:</strong> {owner.address}
                </Typography>

                <Typography variant="body2">
                  <strong>City:</strong> {owner.city}
                </Typography>

                <Typography variant="body2">
                  <strong>Telephone:</strong> {owner.telephone}
                </Typography>
              </Stack>

              <Divider />

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Pets ({owner.pets?.length ?? 0})
              </Typography>

              {!owner.pets?.length ? (
                <Typography color="text.secondary">
                  No pets registered for this owner.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {owner.pets.map((pet) => (
                    <Button
                      key={pet.id}
                      variant={
                        selectedPetId === pet.id ? "contained" : "outlined"
                      }
                      onClick={() => onSelectPet(pet.id)}
                      disabled={loading}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      {pet.name} — {pet.type?.name ?? "Unknown type"}
                    </Button>
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
