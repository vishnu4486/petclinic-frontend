import { Box, Paper, Stack, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import { AppButton } from "../../../components/common/AppButton";
import {
  AppTable,
  type AppTableColumn,
} from "../../../components/common/AppTable";
import { AppPagination } from "../../../components/common/AppPagination";
import { SearchInput } from "../../../components/common/SearchInput";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";

import type { Owner, OwnerPage } from "../../../types/owner.types";

import type { ApiError } from "../../../types/api.types";

interface OwnerSearchPanelProps {
  search: string;
  onSearchChange: (value: string) => void;

  data: OwnerPage | null;
  loading: boolean;
  error: ApiError | null;

  page: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRefresh: () => void;
  onSelectOwner: (ownerId: number) => void;

  // New callback for opening Add Owner dialog
  onAddOwner: () => void;

  selectedOwnerId?: number;
}

const columns: AppTableColumn<Owner>[] = [
  {
    id: "name",
    label: "Owner",
    render: (owner) => `${owner.firstName} ${owner.lastName}`,
  },
  {
    id: "city",
    label: "City",
    render: (owner) => owner.city,
  },
];

export function OwnerSearchPanel({
  search,
  onSearchChange,
  data,
  loading,
  error,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onSelectOwner,
  onAddOwner,
  selectedOwnerId,
}: OwnerSearchPanelProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Find Owner
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Search owners by last name.
            </Typography>
          </Box>

          {/* New Owner Button */}
          <AppButton startIcon={<AddIcon />} onClick={onAddOwner}>
            New Owner
          </AppButton>
        </Box>

        {/* Existing Search */}
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by last name"
        />

        {/* Existing Refresh */}
        <Box>
          <AppButton
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </AppButton>
        </Box>

        {/* Error Handling */}
        {error && <ErrorState message={error.message} onRetry={onRefresh} />}

        {/* Loading and Owner List */}
        {loading ? (
          <LoadingState message="Loading owners..." />
        ) : !error ? (
          <>
            <AppTable
              columns={columns}
              rows={data?.content ?? []}
              getRowId={(owner) =>
                owner.id ??
                `${owner.firstName}-${owner.lastName}-${owner.telephone}`
              }
              selectedRowId={selectedOwnerId}
              onRowClick={(owner) => {
                if (owner.id !== undefined) {
                  onSelectOwner(owner.id);
                }
              }}
              emptyMessage="No owners found."
            />

            <AppPagination
              page={page}
              pageSize={pageSize}
              totalPages={data?.totalPages ?? 0}
              totalElements={data?.totalElements ?? 0}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : null}
      </Stack>
    </Paper>
  );
}
