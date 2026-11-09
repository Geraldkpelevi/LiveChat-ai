import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Settings,
  Users as UsersIcon,
  Loader2,
  RefreshCw,
  BriefcaseBusiness,
} from "lucide-react";

import {
  useEmployees,
  useUpdateEmployeeRole,
  useDeleteEmployee,
  useUpdateEmployeeStatus,
} from "../../hooks/useEmployees";

const roleStyles = {
  ADMIN: "bg-slate-900 text-white",
  AGENT: "bg-emerald-100 text-emerald-700",
  EMPLOYEE: "bg-blue-100 text-blue-700",
  MANAGER: "bg-purple-100 text-purple-700",
  SUPERVISOR: "bg-indigo-100 text-indigo-700",
  HR: "bg-pink-100 text-pink-700",
  ACCOUNTANT: "bg-amber-100 text-amber-700",
  TEAM_LEAD: "bg-teal-100 text-teal-700",
};

const employeeRoles = [
  "EMPLOYEE",
  "AGENT",
  "MANAGER",
  "SUPERVISOR",
  "HR",
  "ACCOUNTANT",
  "IT_SUPPORT",
  "SALES",
  "MARKETING",
  "DEVELOPER",
  "DESIGNER",
  "ANALYST",
  "CONSULTANT",
  "PROJECT_MANAGER",
  "TEAM_LEAD",
  "DIRECTOR",
  "VP",
  "C_LEVEL",
  "ADMIN",
];

const Employees = () => {
  const {
    data: employees = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEmployees();

  const updateRoleMutation = useUpdateEmployeeRole();
  const deleteMutation = useDeleteEmployee();
  const updateStatusMutation = useUpdateEmployeeStatus();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [roleUpdatingEmployeeId, setRoleUpdatingEmployeeId] =
    useState(null);

  const [statusUpdatingEmployeeId, setStatusUpdatingEmployeeId] =
    useState(null);

  const [deleteLoadingEmployeeId, setDeleteLoadingEmployeeId] =
    useState(null);

  const getEmployeeId = (employee) =>
    employee._id || employee.id;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  // Search and filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const employeeName = employee.user?.name || "";
      const employeeEmail = employee.user?.email || "";

      const employeeNumber = employee.employeeNumber || "";
      const department = employee.department || "";
      const jobTitle = employee.jobTitle || "";

      const matchesSearch = [
        employeeName,
        employeeEmail,
        employeeNumber,
        department,
        jobTitle,
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

      const matchesRole =
        !role || employee.user?.role === role;

      const matchesStatus =
        !status || employee.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, search, role, status]);

  // Update employee role
  const onRoleChange = async (employeeId, newRole) => {
    const confirmed = window.confirm(
      `Are you sure you want to assign the ${newRole} system role to this employee?`
    );

    if (!confirmed) return;

    setRoleUpdatingEmployeeId(employeeId);

    try {
      await updateRoleMutation.mutateAsync({
        employeeId,
        role: newRole,
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to update employee role."
      );
    } finally {
      setRoleUpdatingEmployeeId(null);
    }
  };

  // Update employee status
  const onStatusChange = async (employee) => {
    const employeeId = getEmployeeId(employee);

    const newStatus =
      employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to change ${employee.user?.name}'s status to ${newStatus}?`
    );

    if (!confirmed) return;

    setStatusUpdatingEmployeeId(employeeId);

    try {
      await updateStatusMutation.mutateAsync({
        employeeId,
        status: newStatus,
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to update employee status."
      );
    } finally {
      setStatusUpdatingEmployeeId(null);
    }
  };

  // Delete employee
  const onDeleteEmployee = async (employee) => {
    const employeeId = getEmployeeId(employee);

    const confirmed = window.confirm(
      `Are you sure you want to remove ${employee.user?.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleteLoadingEmployeeId(employeeId);

    try {
      await deleteMutation.mutateAsync(employeeId);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to remove employee."
      );
    } finally {
      setDeleteLoadingEmployeeId(null);
    }
  };

  const handleRefreshEmployees = () => {
    setSearch("");
    setRole("");
    setStatus("");
    refetch();
  };

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status !== "ACTIVE"
  ).length;

  const actionLoading =
    updateRoleMutation.isPending ||
    updateStatusMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Home / Administration / Employee Management
            </p>
          </div>
        </div>

        {/* Employee Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total Employees */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Employees
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {employees.length}
                </h2>
              </div>

              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <UsersIcon size={25} />
              </div>
            </div>
          </div>

          {/* Active Employees */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Employees
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {activeEmployees}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <BriefcaseBusiness size={25} />
              </div>
            </div>
          </div>

          {/* Inactive Employees */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Inactive Employees
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {inactiveEmployees}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                <UsersIcon size={25} />
              </div>
            </div>
          </div>

        </div>

        {/* Employees Table */}
        <div
          className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          aria-busy={isFetching}
        >

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
              >
                <option value="">All Roles</option>

                {employeeRoles.map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              <button
                onClick={handleRefreshEmployees}
                disabled={isLoading || isFetching}
                className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                title="Clear filters and refresh employees"
                aria-label="Refresh employees"
              >
                <RefreshCw
                  size={17}
                  className={
                    isFetching ? "animate-spin" : ""
                  }
                />
              </button>

            </div>

            {/* Filtering Overlay */}
            {isFetching && !isLoading && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow">
                  <Loader2
                    size={18}
                    className="animate-spin text-teal-700"
                  />
                  Refreshing employees...
                </div>
              </div>
            )}

          </div>

          {/* Table Information */}
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing {filteredEmployees.length} of{" "}
              {employees.length} total employees
            </p>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">

              <thead className="border-y border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-5 py-4">Department</th>
                  <th className="px-5 py-4">Employee Role</th>
                  <th className="px-5 py-4">Account Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <Loader2 className="mx-auto animate-spin text-teal-700" />

                      <p className="mt-2 text-sm text-gray-500">
                        Loading employees...
                      </p>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <p className="text-sm text-red-600">
                        {error?.response?.data?.message ||
                          error?.message ||
                          "Failed to retrieve employees."}
                      </p>

                      <button
                        onClick={() => refetch()}
                        className="mt-3 text-sm font-semibold text-teal-700"
                      >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-16 text-center text-gray-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => {
                    const employeeId = getEmployeeId(employee);
                    const user = employee.user || {};

                    return (
                      <tr
                        key={employeeId}
                        className="transition hover:bg-gray-50"
                      >

                        {/* Employee Information */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                              {getInitials(user.name)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {user.name || "Unknown"}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {user.email || "No email"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {employee.employeeNumber}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700">
                            {employee.department}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {employee.jobTitle}
                          </p>
                        </td>

                        {/* Employee System Role */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">

                            <select
                              id={`role-${employeeId}`}
                              value={user.role || "EMPLOYEE"}
                              disabled={
                                actionLoading ||
                                roleUpdatingEmployeeId === employeeId
                              }
                              onChange={(e) =>
                                onRoleChange(
                                  employeeId,
                                  e.target.value
                                )
                              }
                              className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${
                                roleStyles[user.role] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {employeeRoles.map((item) => (
                                <option
                                  key={item}
                                  value={item}
                                  className="bg-white text-gray-800"
                                >
                                  {item.replaceAll("_", " ")}
                                </option>
                              ))}
                            </select>

                            {roleUpdatingEmployeeId === employeeId && (
                              <Loader2
                                size={15}
                                className="animate-spin text-teal-700"
                                aria-label="Updating role"
                              />
                            )}

                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            Job: {employee.employmentRole?.replaceAll("_", " ")}
                          </p>
                        </td>

                        {/* Employee Status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">

                            <button
                              onClick={() => onStatusChange(employee)}
                              disabled={actionLoading}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                                employee.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : employee.status === "SUSPENDED"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {employee.status}
                            </button>

                            {statusUpdatingEmployeeId === employeeId && (
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
                                  .getElementById(`role-${employeeId}`)
                                  ?.focus()
                              }
                              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-700"
                            >
                              <Settings size={15} />
                              Modify Role
                            </button>

                            <button
                              onClick={() =>
                                onDeleteEmployee(employee)
                              }
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleteLoadingEmployeeId === employeeId ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={15} />
                              )}

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

        </div>
      </div>
    </div>
  );
};

export default Employees;