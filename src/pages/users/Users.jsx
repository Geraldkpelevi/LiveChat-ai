
import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users as UsersIcon,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

import useUsers from "../../hooks/useUsers";

const roleStyles = {
  ADMIN: "bg-slate-900 text-white",
  AGENT: "bg-emerald-100 text-emerald-700",
  CUSTOMER: "bg-amber-100 text-amber-700",
};

const Users = () => {
  const {
    users,
    pagination,
    search,
    role,
    status,
    page,
    loading,
    isFiltering,
    error,
    actionLoading,
    roleUpdatingUserId,
    statusUpdatingUserId,
    fetchUsers,
    handleRefreshUsers,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    handleUpdateRole,
    handleUpdateStatus,
    handleDeleteUser,
    handleCreateAgent,
    nextPage,
    previousPage,
    goToPage,
  } = useUsers();

  const [showAddModal, setShowAddModal] = useState(false);
  const [addingAgent, setAddingAgent] = useState(false);

  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    password: "",
  });

  const getUserId = (user) => user.id || user._id;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const onRoleChange = async (userId, newRole) => {
    const success = await handleUpdateRole(userId, newRole);

    if (!success) {
      alert("Unable to update user role.");
    }
  };

  const onStatusChange = async (user) => {
    const success = await handleUpdateStatus(
      getUserId(user),
      !user.isActive
    );

    if (!success) {
      alert("Unable to update account status.");
    }
  };

  const onDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${user.name}?`
    );

    if (!confirmed) return;

    const success = await handleDeleteUser(getUserId(user));

    if (!success) {
      alert("Unable to remove user.");
    }
  };

  const onAddAgent = async (e) => {
    e.preventDefault();

    setAddingAgent(true);

    const success = await handleCreateAgent(newAgent);

    if (success) {
      setShowAddModal(false);
      setNewAgent({
        name: "",
        email: "",
        password: "",
      });
    } else {
      alert("Unable to create support agent.");
    }

    setAddingAgent(false);
  };

  const startItem =
    pagination.totalUsers === 0
      ? 0
      : (page - 1) * pagination.pageLimit + 1;

  const endItem = Math.min(
    page * pagination.pageLimit,
    pagination.totalUsers
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Home / Administration / User Management
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-500"
          >
            <Plus size={18} />
            Add Agent
          </button>
        </div>

        {/* Total Users */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {pagination.totalUsers}
                </h2>
              </div>

              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <UsersIcon size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
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
                placeholder="Search users..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={role}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
              >
                <option value="">All Roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Agent</option>
                <option value="ADMIN">Admin</option>
              </select>

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
                onClick={handleRefreshUsers}
                disabled={loading || isFiltering}
                className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                title="Clear filters and load all users"
                aria-label="Clear filters and load all users"
              >
                <RefreshCw
                  size={17}
                  className={loading || isFiltering ? "animate-spin" : ""}
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
                  Loading users...
                </div>
              </div>
            )}
          </div>

          {/* Table Information */}
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing {users.length} of {pagination.totalUsers} total users
            </p>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">

              <thead className="border-y border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">User Role</th>
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
                        Loading users...
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <p className="text-sm text-red-600">{error}</p>

                      <button
                        onClick={fetchUsers}
                        className="mt-3 text-sm font-semibold text-teal-700"
                      >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const userId = getUserId(user);

                    return (
                      <tr
                        key={userId}
                        className="transition hover:bg-gray-50"
                      >
                        {/* User Information */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                              {getInitials(user.name)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {user.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* User Role */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              id={`role-${userId}`}
                              value={user.role}
                              disabled={actionLoading}
                              onChange={(e) =>
                                onRoleChange(userId, e.target.value)
                              }
                              className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${
                                roleStyles[user.role] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="AGENT">Agent</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                            {roleUpdatingUserId === userId && (
                              <Loader2
                                size={15}
                                className="animate-spin text-teal-700"
                                aria-label="Updating role"
                              />
                            )}
                          </div>
                        </td>

                        {/* Account Status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onStatusChange(user)}
                              disabled={actionLoading}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                                user.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </button>
                            {statusUpdatingUserId === userId && (
                              <Loader2
                                size={15}
                                className="animate-spin text-teal-700"
                                aria-label="Updating status"
                              />
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                document
                                  .getElementById(`role-${userId}`)
                                  ?.focus()
                              }
                              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-700"
                            >
                              <Settings size={15} />
                              Modify Role
                            </button>

                            <button
                              onClick={() => onDeleteUser(user)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              Remove
                            </button>
                          </div>
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
              Showing {startItem}–{endItem} of {pagination.totalUsers}
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

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Add Support Agent
              </h2>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onAddAgent} className="space-y-4">

              <input
                type="text"
                required
                placeholder="Full name"
                value={newAgent.name}
                onChange={(e) =>
                  setNewAgent({
                    ...newAgent,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />

              <input
                type="email"
                required
                placeholder="Email address"
                value={newAgent.email}
                onChange={(e) =>
                  setNewAgent({
                    ...newAgent,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />

              <input
                type="password"
                required
                minLength={8}
                placeholder="Temporary password"
                value={newAgent.password}
                onChange={(e) =>
                  setNewAgent({
                    ...newAgent,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />

              <button
                type="submit"
                disabled={addingAgent}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
              >
                {addingAgent && (
                  <Loader2 size={17} className="animate-spin" />
                )}

                {addingAgent ? "Creating Agent..." : "Create Agent"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
