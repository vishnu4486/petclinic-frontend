import {
  Box,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";

interface AppPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function AppPagination({
  page,
  pageSize,
  totalPages,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: AppPaginationProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mt: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Total records: {totalElements}
      </Typography>

      <Pagination
        count={Math.max(1, totalPages)}
        page={page + 1}
        onChange={(_, value) => onPageChange(value - 1)}
        color="primary"
        disabled={totalPages <= 1}
      />

      <TextField
        select
        size="small"
        label="Rows per page"
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        sx={{ minWidth: 140 }}
      >
        {[5, 10, 20, 50].map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
