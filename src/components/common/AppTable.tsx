import type { Key, ReactNode } from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export interface AppTableColumn<T> {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
}

interface AppTableProps<T> {
  columns: AppTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => Key;
  onRowClick?: (row: T) => void;
  selectedRowId?: Key | null;
  emptyMessage?: string;
}

export function AppTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  selectedRowId,
  emptyMessage = "No records found.",
}: AppTableProps<T>) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{ fontWeight: 700 }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const rowId = getRowId(row);

              return (
                <TableRow
                  key={rowId}
                  hover={Boolean(onRowClick)}
                  selected={selectedRowId === rowId}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
