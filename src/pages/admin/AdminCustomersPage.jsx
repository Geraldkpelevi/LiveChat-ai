
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users as UsersIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

import useCustomers from "../../hooks/useCustomers";

const AdminCustomersPage = () => {
  const {
    customers,
    pagination,
    search,
    status,
    page,
    loading,
    isFiltering,
    error,
    actionLoading,
    statusUpdatingCustomerId,
    fetchCustomers,
    handleRefreshCustomers,
    handleSearch,
    handleStatusFilter,
    handleUpdateStatus,
    handleDeleteCustomer,
    nextPage,
    previousPage,
    goToPage,
  } = useCustomers();

  const getCustomerId = (customer) =>
    customer.id || customer._id;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const onStatusChange = async (customer) => {
    const success = await handleUpdateStatus(
      getCustomerId(customer),
      !customer.isActive
    );

    if (!success) {
      alert("Unable to update customer status.");
    }
  };

  const onDeleteCustomer = async (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${customer.name}?`
    );

    if (!confirmed) return;

    const success = await handleDeleteCustomer(
      getCustomerId(customer)
    );

    if (!success) {
      alert("Unable to remove customer.");
    }
  };

  const startItem =
    pagination.totalCustomers === 0
      ? 0
      : (page - 1) * pagination.pageLimit + 1;

  const endItem = Math.min(
    page * pagination.pageLimit,
    pagination.totalCustomers
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Home / Administration / Customers
          </p>
        </div>

        {/* Total Customers */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Customers
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {pagination.totalCustomers}
                </h2>
              </div>

              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <UsersIcon size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div
          className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          aria-busy={isFiltering}
        >
          {/* Search and Filters */}
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                onClick={handleRefreshCustomers}
                disabled={loading || isFiltering}
                className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                title="Clear filters and refresh customers"
                aria-label="Clear filters and refresh customers"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading || isFiltering ? "animate-spin" : ""
                  }
                />
              </button>
            </div>

            {isFiltering && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow">
                  <Loader2
                    size={18}
                    className="animate-spin text-teal-700"
                    aria-hidden="true"
                  />
                  Loading customers...
                </div>
              </div>
            )}
          </div>

          {/* Table Information */}
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing {customers.length} of{" "}
              {pagination.totalCustomers} total customers
            </p>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-y border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Account Type</th>
                  <th className="px-5 py-4">Account Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <Loader2 className="mx-auto animate-spin text-teal-700" />
                      <p className="mt-2 text-sm text-gray-500">
                        Loading customers...
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <p className="text-sm text-red-600">
                        {error}
                      </p>

                      <button
                        onClick={fetchCustomers}
                        className="mt-3 text-sm font-semibold text-teal-700"
                      >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-16 text-center text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => {
                    const customerId = getCustomerId(customer);

                    return (
                      <tr
                        key={customerId}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Customer Information */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                              {getInitials(customer.name)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {customer.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Account Type */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                            Customer
                          </span>
                        </td>

                        {/* Account Status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onStatusChange(customer)}
                              disabled={actionLoading}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                                customer.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {customer.isActive ? "Active" : "Inactive"}
                            </button>

                            {statusUpdatingCustomerId === customerId && (
                              <Loader2
                                size={15}
                                className="animate-spin text-teal-700"
                                aria-label="Updating customer status"
                              />
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => onDeleteCustomer(customer)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            {actionLoading ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}

                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing {startItem}–{endItem} of{" "}
              {pagination.totalCustomers}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                title="First page"
              >
                <ChevronsLeft size={17} />
              </button>

              <button
                onClick={previousPage}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                title="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="px-3 text-sm font-semibold text-gray-700">
                {pagination.currentPage} / {pagination.totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={page >= pagination.totalPages || loading}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                title="Next page"
              >
                <ChevronRight size={17} />
              </button>

              <button
                onClick={() => goToPage(pagination.totalPages)}
                disabled={page >= pagination.totalPages || loading}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                title="Last page"
              >
                <ChevronsRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
