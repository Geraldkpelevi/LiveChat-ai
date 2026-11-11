import {
  BriefcaseBusiness,
  Loader2,
  PlusIcon,
  RefreshCw,
  Search,
  Settings,
  Timer,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useActiveAttendance } from "../../hooks/useActiveAttendance";

import CreateEmployeeModal from "../../components/employees/CreateEmployeeModal";

import DataTable from "../../components/DataTable";
import {
  useAllEmployees,
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployeeRole,
  useUpdateEmployeeStatus,
} from "../../hooks/useEmployees";
import formatDuration from "../../utils/formatDuration";

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
  "TIMEKEEPER",
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

const EMPLOYEE_PAGE_LIMIT = 10;
const EMPTY_EMPLOYEES = [];

const Employees = () => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    mutateAsync: createEmployee,
    isPending,
    error: createEmployeeError,
  } = useCreateEmployee();

  const {
    data: employeeData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEmployees({ page, limit: EMPLOYEE_PAGE_LIMIT, status });
  const {
    data: allEmployees = EMPTY_EMPLOYEES,
    isLoading: isLoadingAllEmployees,
    isError: isEmployeeCountError,
    error: employeeCountError,
  } = useAllEmployees();
  const {
    employees: attendanceRecords,
    isLoading: isLoadingAttendance,
    isError: isAttendanceError,
    error: attendanceError,
  } = useActiveAttendance();

  const employees = employeeData?.employees || EMPTY_EMPLOYEES;
  const employeePagination = employeeData?.pagination;
  const pagination = {
    totalRecords: employeePagination?.totalRecords ?? 0,
    currentPage: employeePagination?.currentPage ?? page,
    totalPages: Math.max(1, employeePagination?.totalPages ?? 1),
    pageLimit: employeePagination?.pageLimit ?? EMPLOYEE_PAGE_LIMIT,
  };

  const updateRoleMutation = useUpdateEmployeeRole();
  const deleteMutation = useDeleteEmployee();
  const updateStatusMutation = useUpdateEmployeeStatus();

  const [roleUpdatingEmployeeId, setRoleUpdatingEmployeeId] = useState(null);

  const [statusUpdatingEmployeeId, setStatusUpdatingEmployeeId] =
    useState(null);

  const [deleteLoadingEmployeeId, setDeleteLoadingEmployeeId] = useState(null);

  const getEmployeeId = (employee) => employee._id || employee.id;

  const attendanceByEmployee = useMemo(() => {
    const recordsByEmployee = new Map();

    attendanceRecords.forEach((record) => {
      const attendanceEmployee = record.employee;
      const employeeId =
        typeof attendanceEmployee === "object"
          ? attendanceEmployee?._id || attendanceEmployee?.id
          : attendanceEmployee;

      if (employeeId && !recordsByEmployee.has(String(employeeId))) {
        recordsByEmployee.set(String(employeeId), record);
      }
    });

    return recordsByEmployee;
  }, [attendanceRecords]);

  const handleCreateEmployee = async (employeeData) => {
    await createEmployee(employeeData);

    setShowCreateModal(false);
    refetch();
  };
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
      ].some((value) => value.toLowerCase().includes(search.toLowerCase()));

      const matchesRole = !role || employee.user?.role === role;

      const matchesStatus = !status || employee.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, search, role, status]);

  // Update employee role
  const onRoleChange = async (employeeId, newRole) => {
    const confirmed = window.confirm(
      `Are you sure you want to assign the ${newRole} system role to this employee?`,
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
        error?.response?.data?.message || "Unable to update employee role.",
      );
    } finally {
      setRoleUpdatingEmployeeId(null);
    }
  };

  // Update employee status
  const onStatusChange = async (employee) => {
    const employeeId = getEmployeeId(employee);

    const newStatus = employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to change ${employee.user?.name}'s status to ${newStatus}?`,
    );

    if (!confirmed) return;

    setStatusUpdatingEmployeeId(employeeId);

    try {
      await updateStatusMutation.mutateAsync({
        employeeId,
        status: newStatus,
      });
      setPage(1);
    } catch (error) {
      alert(
        error?.response?.data?.message || "Unable to update employee status.",
      );
    } finally {
      setStatusUpdatingEmployeeId(null);
    }
  };

  // Delete employee
  const onDeleteEmployee = async (employee) => {
    const employeeId = getEmployeeId(employee);

    const confirmed = window.confirm(
      `Are you sure you want to remove ${employee.user?.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleteLoadingEmployeeId(employeeId);

    try {
      await deleteMutation.mutateAsync(employeeId);
      if (employees.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to remove employee.");
    } finally {
      setDeleteLoadingEmployeeId(null);
    }
  };

  const handleRefreshEmployees = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
    refetch();
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const goToPage = (pageNumber) => {
    setPage(Math.max(1, Math.min(pageNumber, pagination.totalPages)));
  };

  const activeEmployees = allEmployees.filter(
    (employee) => employee.status === "ACTIVE",
  ).length;
  const pendingEmployees = allEmployees.filter(
    (employee) => employee.status === "PENDING",
  ).length;
  const inactiveEmployees = allEmployees.filter(
    (employee) => employee.status === "INACTIVE",
  ).length;
  const employeeCountErrorMessage =
    employeeCountError?.response?.data?.message ||
    employeeCountError?.message ||
    "Unable to load employee counts.";

  const actionLoading =
    updateRoleMutation.isPending ||
    updateStatusMutation.isPending ||
    deleteMutation.isPending;

  const employeeColumns = [
    {
      key: "employee",
      header: "Employee",
      render: (employee) => {
        const user = employee.user || {};

        return (
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
        );
      },
    },
    {
      key: "department",
      header: "Department",
      render: (employee) => (
        <>
          <p className="font-medium text-gray-700">{employee.department}</p>

          <p className="mt-1 text-xs text-gray-500">{employee.jobTitle}</p>
        </>
      ),
    },
    {
      key: "role",
      header: "Employee Role",
      render: (employee) => {
        const employeeId = getEmployeeId(employee);
        const user = employee.user || {};

        return (
          <div>
            <div className="flex items-center gap-2">
              <select
                id={`role-${employeeId}`}
                value={user.role || "EMPLOYEE"}
                disabled={
                  actionLoading || roleUpdatingEmployeeId === employeeId
                }
                onChange={(e) => onRoleChange(employeeId, e.target.value)}
                className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${
                  roleStyles[user.role] || "bg-gray-100 text-gray-700"
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
          </div>
        );
      },
    },
    {
      key: "workDuration",
      header: "Work Duration (Today)",
      render: (employee) => {
        const attendance = attendanceByEmployee.get(
          String(getEmployeeId(employee)),
        );

        return (
          <div className="flex items-center gap-2 whitespace-nowrap text-gray-700">
            <Timer size={15} className="text-gray-400" />
            {isLoadingAttendance
              ? "Loading..."
              : attendance?.totalWorkedMinutes == null
                ? "—"
                : formatDuration(attendance.totalWorkedMinutes)}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Account Status",
      render: (employee) => {
        const employeeId = getEmployeeId(employee);

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
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
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (employee) => {
        const employeeId = getEmployeeId(employee);

        return (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                document.getElementById(`role-${employeeId}`)?.focus()
              }
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-700"
            >
              <Settings size={15} />
              Modify Role
            </button>

            <button
              type="button"
              onClick={() => onDeleteEmployee(employee)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {deleteLoadingEmployeeId === employeeId ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              Remove
            </button>
          </div>
        );
      },
    },
  ];

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusIcon size={18} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {/* Total Employees */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Employees
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {isLoadingAllEmployees
                    ? "…"
                    : isEmployeeCountError
                      ? "—"
                      : allEmployees.length}
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
                  {isLoadingAllEmployees
                    ? "…"
                    : isEmployeeCountError
                      ? "—"
                      : activeEmployees}
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
                  {isLoadingAllEmployees
                    ? "…"
                    : isEmployeeCountError
                      ? "—"
                      : inactiveEmployees}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                <UsersIcon size={25} />
              </div>
            </div>
          </div>
          {/* Pending Employees */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Employees
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {isLoadingAllEmployees
                    ? "…"
                    : isEmployeeCountError
                      ? "—"
                      : pendingEmployees}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                <UsersIcon size={25} />
              </div>
            </div>
          </div>
        </div>

        {isEmployeeCountError && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {employeeCountErrorMessage}
          </p>
        )}
        {isAttendanceError && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {attendanceError?.response?.data?.message ||
              attendanceError?.message ||
              "Unable to load employee work durations."}
          </p>
        )}

        <DataTable
          columns={employeeColumns}
          data={filteredEmployees}
          getRowKey={getEmployeeId}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          error={error}
          onRetry={refetch}
          emptyMessage="No employees found."
          loadingMessage="Loading employees..."
          minWidth="950px"
          pagination={{
            pagination,
            page,
            goToPage,
          }}
          toolbar={
            <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
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
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING">Pending</option>
                </select>

                <button
                  type="button"
                  onClick={handleRefreshEmployees}
                  disabled={isLoading || isFetching}
                  className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  title="Clear filters and refresh employees"
                  aria-label="Refresh employees"
                >
                  <RefreshCw
                    size={17}
                    className={isFetching ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>
          }
          summary={
            <p className="text-xs text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} on this
              page ({pagination.totalRecords} total employees)
            </p>
          }
        />
      </div>
      <CreateEmployeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEmployee}
        isPending={isPending}
        error={createEmployeeError}
      />
    </div>
  );
};

export default Employees;
