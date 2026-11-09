import { useMemo, useState } from "react";
import {
  Clock,
  Coffee,
  Users,
  RefreshCw,
  Search,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  UserRound,
} from "lucide-react";

import { useActiveAttendance } from "../hooks/useActiveAttendance";

const ITEMS_PER_PAGE = 10;

const formatTime = (date) => {
  if (!date) return "--";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date) => {
  if (!date) return "--";

  return new Date(date).toLocaleDateString();
};

const formatDuration = (minutes = 0) => {
  const value = Number(minutes) || 0;

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  return `${hours}h ${remainingMinutes}m`;
};

const getEmployeeName = (record) => {
  const employee = record.employee;
  const user = employee?.user;

  return (
    user?.name ||
    employee?.name ||
    record.employeeName ||
    "Unknown Employee"
  );
};

const getEmployeeNumber = (record) => {
  return (
    record.employee?.employeeNumber ||
    record.employeeNumber ||
    "N/A"
  );
};

const getDepartment = (record) => {
  return record.employee?.department || "Not assigned";
};

const getShift = (record) => {
  const shift =
    record.shift ||
    record.employee?.shift ||
    record.shiftSnapshot;

  if (!shift) return "No shift assigned";

  if (typeof shift === "string") return shift;

  return shift.name || "No shift assigned";
};

const getBreakDuration = (record) => {
  const breaks = record.breaks || [];

  const completedBreaks = breaks.reduce((total, item) => {
    if (!item.startedAt || !item.endedAt) return total;

    return (
      total +
      Math.floor(
        (new Date(item.endedAt) - new Date(item.startedAt)) / 60000,
      )
    );
  }, 0);

  const activeBreak = breaks.find(
    (item) => item.startedAt && !item.endedAt,
  );

  if (!activeBreak) {
    return record.totalBreakMinutes ?? completedBreaks;
  }

  const currentBreakMinutes = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(activeBreak.startedAt)) / 60000,
    ),
  );

  return completedBreaks + currentBreakMinutes;
};

const isOffDuty = (record) =>
  Boolean(record.clockOutTime) ||
  ["CLOCKED_OUT", "OFF_DUTY", "DUTY_ENDED", "COMPLETED"].includes(
    record.status,
  );

const StatusBadge = ({ record }) => {
  const isOnBreak = record.status === "ON_BREAK";
  const isOffDutyRecord = isOffDuty(record);
  const label = isOnBreak
    ? "On Break"
    : isOffDutyRecord
      ? "Off Duty"
      : "On Duty";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isOnBreak
          ? "bg-amber-50 text-amber-700"
          : isOffDutyRecord
            ? "bg-gray-100 text-gray-600"
            : "bg-green-50 text-green-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isOnBreak
            ? "bg-amber-500"
            : isOffDutyRecord
              ? "bg-gray-400"
              : "bg-green-500"
        }`}
      />

      {label}
    </span>
  );
};

const ActiveEmployeesTable = () => {
  const {
    employees,
    totalOnDuty,
    totalOnBreak,
    totalOffDuty,
    totalActive,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useActiveAttendance();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate department filter options
  const departments = useMemo(() => {
    return [
      ...new Set(
        employees
          .map((record) => getDepartment(record))
          .filter((department) => department !== "Not assigned"),
      ),
    ].sort();
  }, [employees]);

  // Search and filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((record) => {
      const employeeName = getEmployeeName(record).toLowerCase();
      const employeeNumber = getEmployeeNumber(record).toLowerCase();
      const department = getDepartment(record);
      const status = record.status;

      const searchMatch =
        employeeName.includes(search.toLowerCase()) ||
        employeeNumber.includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "OFF_DUTY"
          ? isOffDuty(record)
          : status === statusFilter);

      const departmentMatch =
        departmentFilter === "ALL" ||
        department === departmentFilter;

      return searchMatch && statusMatch && departmentMatch;
    });
  }, [employees, search, statusFilter, departmentFilter]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE),
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startItem =
    filteredEmployees.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredEmployees.length,
  );

  const handleFilterChange = (callback, value) => {
    callback(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-3 text-gray-500">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading employee attendance...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">
            Failed to retrieve employee attendance.
          </p>
        </div>

        <p className="mt-2 text-sm text-red-600">
          {error.response?.data?.message || error.message}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Attendance Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review employees currently working, on break, or off duty.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Active Employees
              </p>

              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {totalActive}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Employees On Duty
              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {totalOnDuty}
              </h3>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Employees On Break
              </p>

              <h3 className="mt-2 text-2xl font-bold text-amber-600">
                {totalOnBreak}
              </h3>
            </div>

            <div className="rounded-lg bg-amber-50 p-3">
              <Coffee className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Employees Off Duty
              </p>

              <h3 className="mt-2 text-2xl font-bold text-gray-600">
                {totalOffDuty}
              </h3>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Clock className="h-6 w-6 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleFilterChange(setSearch, e.target.value)
                }
                placeholder="Search employee or number..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) =>
                handleFilterChange(
                  setDepartmentFilter,
                  e.target.value,
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "All Attendance", value: "ALL" },
              { label: "On Duty", value: "ON_DUTY" },
              { label: "On Break", value: "ON_BREAK" },
              { label: "Off Duty", value: "OFF_DUTY" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  handleFilterChange(
                    setStatusFilter,
                    filter.value,
                  )
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  statusFilter === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Employee
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Department
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Assigned Shift
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Clock In
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Clock Out
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Break Duration
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((record) => (
                  <tr
                    key={record._id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                          <UserRound className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getEmployeeName(record)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {getEmployeeNumber(record)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {getDepartment(record)}
                    </td>

                    {/* Shift */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarClock className="h-4 w-4 text-gray-400" />
                        {getShift(record)}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(record.clockInTime)}
                    </td>

                    {/* Clock In */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {formatTime(record.clockInTime)}
                      </p>
                    </td>

                    {/* Clock Out */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {formatTime(record.clockOutTime)}
                      </p>
                    </td>

                    {/* Break Duration */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {formatDuration(getBreakDuration(record))}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge record={record} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <Users className="mx-auto h-10 w-10 text-gray-300" />

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No attendance records found
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing {startItem}–{endItem} of{" "}
            {filteredEmployees.length} employees
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.max(1, previous - 1),
                )
              }
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(totalPages, previous + 1),
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Attendance automatically refreshes every 30 seconds.
        {isFetching && " Updating attendance..."}
      </p>
    </div>
  );
};

export default ActiveEmployeesTable;