import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination({
  initialPage = 0,
  initialPageSize = 10,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const changePage = (newPage: number) => {
    setPage(Math.max(0, newPage));
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const resetPagination = () => {
    setPage(0);
  };

  return {
    page,
    pageSize,
    changePage,
    changePageSize,
    resetPagination,
  };
}
