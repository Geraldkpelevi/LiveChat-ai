
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  pagination,
  page,
  goToPage,
  isLoading = false,
  isFetching = false,
}) => {
  const currentPage = pagination?.currentPage || page || 1;
  const totalPages = pagination?.totalPages || 0;
  const totalRecords = pagination?.totalRecords || 0;

  const isDisabled = isLoading || isFetching;

  const startItem =
    totalRecords === 0 ? 0 : (currentPage - 1) * (pagination?.limit || 10) + 1;

  const endItem = Math.min(
    currentPage * (pagination?.limit || 10),
    totalRecords
  );

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages || totalPages === 0;

  if (totalPages <= 1 && totalRecords === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row">
      <p className="text-sm text-gray-500">
        Showing {startItem}–{endItem} of {totalRecords}
      </p>

      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => goToPage(1)}
          disabled={isFirstPage || isDisabled}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          title="First page"
          aria-label="First page"
        >
          <ChevronsLeft size={17} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={isFirstPage || isDisabled}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Previous page"
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>

        {/* Current Page */}
        <span className="px-3 text-sm font-semibold text-gray-700">
          {currentPage} / {totalPages}
        </span>

        {/* Next Page */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={isLastPage || isDisabled}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Next page"
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={isLastPage || isDisabled}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Last page"
          aria-label="Last page"
        >
          <ChevronsRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
