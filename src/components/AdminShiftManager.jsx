
import {
  AlertCircle,
  CalendarClock,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import DataTable from "../components/DataTable";
import { useAdminShiftManager } from "../hooks/useAdminShiftManager";

import {
  getEmployeeId,
  getEmployeeName,
  getEmployeeRole,
  getEmployeeShift,
  isEmployeeOnShift,
} from "../services/adminShiftManagerService";

const AdminShiftManager = ({
  attendanceRecords = [],
  onClose,
}) => {
  const {
    filteredEmployees,
    attendanceByEmployee,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    shiftIds,
    handleShiftIdChange,
    message,
    error,
    isLoading,
    isFetching,
    isPending,
    clockingEmployeeId,
    refetch,
    handleClockToggle,
    handleShiftAssignment,
    handleShiftRemoval,
  } = useAdminShiftManager(attendanceRecords);

  // Close modal when clicking outside
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Get shift start and end times
  const getShiftTimes = (shift) => ({
    start: shift?.startTime || shift?.start || "—",
    end: shift?.endTime || shift?.end || "—",
  });

  // Table columns
  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (employee) => {
        const employeeId = getEmployeeId(employee);
        const attendance = attendanceByEmployee.get(
          String(employeeId),
        );

        return (
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {getEmployeeName(employee)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {getEmployeeRole(employee)}
              {employee.employeeNumber
                ? ` · ${employee.employeeNumber}`
                : ""}
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                attendance?.status
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {attendance?.status
                ? attendance.status.replaceAll("_", " ")
                : "Off duty"}
            </span>
          </div>
        );
      },
    },

    {
      key: "assignedShift",
      header: "Assigned Shift",
      render: (employee) => {
        const assignedShift = getEmployeeShift(employee);
        const { start, end } = getShiftTimes(assignedShift);

        return (
          <div className="min-w-0">
            <p className="font-medium text-gray-800">
              {assignedShift?.name || "No shift assigned"}
            </p>

            {/* Start and End Shift on the same line */}
            {assignedShift && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 whitespace-nowrap text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Clock
                    size={13}
                    className="text-emerald-600"
                  />
                  <span className="font-medium text-gray-600">
                    Start:
                  </span>
                  {start}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Clock
                    size={13}
                    className="text-red-500"
                  />
                  <span className="font-medium text-gray-600">
                    End:
                  </span>
                  {end}
                </span>
              </div>
            )}
          </div>
        );
      },
    },

    {
      key: "shiftControls",
      header: "Shift Assignment",
      cellClassName: "px-5 py-4 min-w-[280px]",
      render: (employee) => {
        const employeeId = getEmployeeId(employee);
        const assignedShift = getEmployeeShift(employee);
        const currentShiftId = assignedShift?._id || "";

        return (
          <div className="flex items-center gap-2">
            <label
              className="sr-only"
              htmlFor={`shift-${employeeId}`}
            >
              Existing shift ID for {getEmployeeName(employee)}
            </label>

            <input
              id={`shift-${employeeId}`}
              type="text"
              value={
                shiftIds[employeeId] ?? currentShiftId
              }
              onChange={(event) =>
                handleShiftIdChange(
                  employeeId,
                  event.target.value,
                )
              }
              disabled={isPending}
              placeholder="Shift ID"
              className="min-w-0 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() =>
                handleShiftAssignment(employee)
              }
              disabled={isPending}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarClock size={14} />
              Assign
            </button>

            {assignedShift && (
              <button
                type="button"
                onClick={() =>
                  handleShiftRemoval(employee)
                }
                disabled={isPending}
                className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
        );
      },
    },

    {
      key: "actions",
      header: "Shift Actions",
      render: (employee) => {
        const employeeId = getEmployeeId(employee);
        const attendance = attendanceByEmployee.get(
          String(employeeId),
        );

        const onShift = isEmployeeOnShift(attendance);
        const isClockingEmployee =
          clockingEmployeeId === String(employeeId);

        return (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              handleClockToggle(employee, onShift)
            }
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              onShift
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isClockingEmployee ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Clock size={14} />
            )}

            {onShift ? "End Shift" : "Start Shift"}
          </button>
        );
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        aria-labelledby="admin-shift-manager-title"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 p-5 sm:p-6">
          <div>
            <h2
              className="text-xl font-semibold text-gray-900"
              id="admin-shift-manager-title"
            >
              Manage employee shifts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Start or end shifts and assign scheduled shifts
              for employees of any role.
            </p>
          </div>

          <button
            aria-label="Close shift manager"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Reusable DataTable */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <DataTable
            columns={columns}
            data={filteredEmployees}
            getRowKey={getEmployeeId}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={Boolean(error)}
            error={error}
            onRetry={refetch}
            emptyMessage="No employees found."
            loadingMessage="Loading employees..."
            minWidth="1050px"
            toolbar={
              <div className="space-y-4 p-4">
                {/* Success / Error Message */}
                {message && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm ${
                      message.type === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                    role={
                      message.type === "error"
                        ? "alert"
                        : "status"
                    }
                  >
                    {message.text}
                  </div>
                )}

                {/* Search */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    aria-label="Search employees"
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by name, email, employee number, role, department, or shift..."
                    value={search}
                  />
                  <select
                    aria-label="Filter employees by shift status"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    value={statusFilter}
                  >
                    <option value="ALL">All shift statuses</option>
                    <option value="ON_DUTY">On duty</option>
                    <option value="ON_BREAK">On break</option>
                    <option value="OFF_DUTY">Off duty</option>
                  </select>
                </div>

                {/* Error notification icon */}
                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle size={15} />
                    Unable to load employees. Please try again.
                  </div>
                )}
              </div>
            }
            summary={
              <p className="text-xs text-gray-500">
                Showing {filteredEmployees.length} employees
              </p>
            }
          />
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
          <p className="text-xs text-gray-500">
            Employee shift management
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
};

export default AdminShiftManager;
