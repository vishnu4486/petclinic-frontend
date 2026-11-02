import { Stack, Typography } from "@mui/material";

import { AppTable } from "../../../components/common/AppTable";
import type { AppTableColumn } from "../../../components/common/AppTable";

import type { Visit } from "../../../types/visit.types";

interface VisitHistoryPanelProps {
  visits: Visit[];
}

const columns: AppTableColumn<Visit>[] = [
  {
    id: "date",
    label: "Date",
    render: (visit) => visit.date ?? "Not specified",
  },
  {
    id: "description",
    label: "Description",
    render: (visit) => visit.description,
  },
];

export function VisitHistoryPanel({ visits }: VisitHistoryPanelProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Visit History ({visits.length})</Typography>

      <AppTable
        columns={columns}
        rows={visits}
        getRowId={(visit) => visit.id}
        emptyMessage="No previous visits."
      />
    </Stack>
  );
}
