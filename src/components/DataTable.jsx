
import { Loader2 } from "lucide-react";
import Pagination from "./Pagination";

const DataTable = ({
  columns = [],
  data = [],
  getRowKey = (row) => row._id || row.id,

  isLoading = false,
  isFetching = false,
  isError = false,
  error = null,
  onRetry,

  emptyMessage = "No records found.",
  loadingMessage = "Loading records...",

  toolbar,
  summary,
  pagination,

  minWidth = "800px",
  className = "",
}) => {
  const columnCount = columns.length;

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong while retrieving records.";

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={columnCount}
            className="px-5 py-16 text-center"
          >
            <Loader2
              size={24}
              className="mx-auto animate-spin text-teal-700"
            />

            <p className="mt-2 text-sm text-gray-500">
              {loadingMessage}
            </p>
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td
            colSpan={columnCount}
            className="px-5 py-16 text-center"
          >
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Try again
              </button>
            )}
          </td>
        </tr>
      );
    }

    if (!data.length) {
      return (
        <tr>
          <td
            colSpan={columnCount}
            className="px-5 py-16 text-center text-sm text-gray-500"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <tr
        key={getRowKey(row, rowIndex)}
        className="transition hover:bg-gray-50"
      >
        {columns.map((column) => (
          <td
            key={column.key}
            className={
              column.cellClassName ||
              "px-5 py-4"
            }
          >
            {column.render
              ? column.render(row, rowIndex)
              : row[column.accessor || column.key] ?? "—"}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      aria-busy={isFetching}
    >
      {/* Toolbar */}
      {toolbar && (
        <div className="border-b border-gray-200">
          {toolbar}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="px-5 py-3">
          {summary}
        </div>
      )}

      {/* Refresh Overlay */}
      {isFetching && !isLoading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 rounded-lg  px-4 py-3 text-sm font-medium text-gray-700 shadow">
            <Loader2
              size={18}
              className="animate-spin text-teal-700"
            />
            Refreshing data...
          </div>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-sm"
          style={{ minWidth }}
        >
          <thead className="border-y border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={
                    column.headerClassName ||
                    "px-5 py-4"
                  }
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {renderTableContent()}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          pagination={pagination.pagination}
          page={pagination.page}
          goToPage={pagination.goToPage}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};

export default DataTable;
