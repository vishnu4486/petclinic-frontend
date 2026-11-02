import { useState } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { AppButton } from "./AppButton";
import { AppTable } from "./AppTable";
import type { AppTableColumn } from "./AppTable";
import { AppFormDialog } from "./AppFormDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import { SearchInput } from "./SearchInput";
import { AppPagination } from "./AppPagination";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

import { usePagination } from "../../hooks/usePagination";
import { useNotification } from "../../hooks/useNotification";

interface DemoOwner {
  id: number;
  name: string;
  city: string;
}

const demoOwners: DemoOwner[] = [
  { id: 1, name: "Rahul Sharma", city: "Pune" },
  { id: 2, name: "Priya Patil", city: "Mumbai" },
  { id: 3, name: "Amit Kumar", city: "Bengaluru" },
];

const columns: AppTableColumn<DemoOwner>[] = [
  {
    id: "name",
    label: "Owner Name",
    render: (row) => row.name,
  },
  {
    id: "city",
    label: "City",
    render: (row) => row.city,
  },
];

export function ComponentShowcase() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { page, pageSize, changePage, changePageSize } = usePagination({
    initialPageSize: 5,
  });

  const { showSuccess } = useNotification();

  const filteredOwners = demoOwners.filter((owner) =>
    owner.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredOwners.length / pageSize);

  const visibleOwners = filteredOwners.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Reusable Components Demo"
          subtitle="Step 3 verification screen"
          actions={
            <AppButton onClick={() => setFormOpen(true)}>
              Open Form Dialog
            </AppButton>
          }
        />

        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            changePage(0);
          }}
          placeholder="Search demo owners"
        />

        <AppTable
          columns={columns}
          rows={visibleOwners}
          getRowId={(row) => row.id}
        />

        <AppPagination
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          totalElements={filteredOwners.length}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />

        <Box>
          <AppButton color="warning" onClick={() => setConfirmOpen(true)}>
            Open Confirmation
          </AppButton>
        </Box>

        <EmptyState
          title="Empty State Demo"
          description="This appears when there are no records."
        />

        <ErrorState
          message="Example API error message."
          onRetry={() => showSuccess("Retry clicked")}
        />

        <AppFormDialog
          open={formOpen}
          title="Demo Form Dialog"
          onClose={() => setFormOpen(false)}
          onSubmit={() => {
            setFormOpen(false);
            showSuccess("Demo form submitted");
          }}
        >
          <Typography>
            The Owner, Pet, and Visit forms will use this dialog.
          </Typography>
        </AppFormDialog>

        <ConfirmDialog
          open={confirmOpen}
          title="Confirm Action"
          message="Do you want to continue?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            showSuccess("Action confirmed");
          }}
        />
      </Stack>
    </Paper>
  );
}
