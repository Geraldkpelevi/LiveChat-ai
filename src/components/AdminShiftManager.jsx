
import {
  AlertCircle,
  CalendarClock,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import { useAdminShiftManager } from "../hooks/useAdminShiftManager";

import {
  getEmployeeId,
  getEmployeeName,
  getEmployeeRole,
  getEmployeeShift,
  isEmployeeOnShift,
} from "../services/adminShiftManagerService";

const AdminShiftManager = ({ attendanceRecords = [], onClose }) => {
  const {
    filteredEmployees,
    attendanceByEmployee,
    search,
    setSearch,
    shiftIds,
    handleShiftIdChange,
    message,
    error,
    isLoading,
    isFetching,
    isPending,
    refetch,
    handleClockToggle,
    handleShiftAssignment,
    handleShiftRemoval,
  } = useAdminShiftManager(attendanceRecords);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        aria-labelledby="admin-shift-manager-title"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
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
              Start or end shifts and assign scheduled shifts for
              employees of any role.
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

        {/* Search and notifications */}
        <div className="border-b border-gray-200 p-5 sm:p-6">
          {message && (
            <p
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
              role={message.type === "error" ? "alert" : "status"}
            >
              {message.text}
            </p>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Unable to load employees:{" "}
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong."}
                </span>
              </div>

              <button
                className="mt-2 font-medium underline"
                onClick={() => refetch()}
                type="button"
              >
                Try again
              </button>
            </div>
          )}

          <input
            aria-label="Search employees"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, employee number, or role..."
            value={search}
          />
        </div>

        {/* Employee list */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading employees...
            </div>
          ) : error ? null : filteredEmployees.length === 0 ? (
            <p className="p-10 text-center text-sm text-gray-500">
              No employees found.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => {
                const employeeId = getEmployeeId(employee);
                const employeeName = getEmployeeName(employee);

                const assignedShift = getEmployeeShift(employee);
                const currentShiftId = assignedShift?._id || "";

                const currentShiftName =
                  assignedShift?.name ||
                  currentShiftId ||
                  "No shift assigned";

                const attendance = attendanceByEmployee.get(
                  String(employeeId),
                );

                const onShift = isEmployeeOnShift(attendance);

                return (
                  <li
                    className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)] lg:items-center"
                    key={employeeId}
                  >
                    {/* Employee information */}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {employeeName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {getEmployeeRole(employee)}
                        {employee.employeeNumber
                          ? ` · ${employee.employeeNumber}`
                          : ""}
                        {" · "}
                        {attendance?.status
                          ? attendance.status.replaceAll("_", " ")
                          : "Off duty"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Assigned shift: {currentShiftName}
                      </p>

                      <button
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                        onClick={() =>
                          handleClockToggle(employee, onShift)
                        }
                        type="button"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}

                        {onShift ? "End shift" : "Start shift"}
                      </button>
                    </div>

                    {/* Shift assignment controls */}
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <label
                        className="sr-only"
                        htmlFor={`shift-${employeeId}`}
                      >
                        Existing shift ID for {employeeName}
                      </label>

                      <input
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        disabled={isPending}
                        id={`shift-${employeeId}`}
                        onChange={(event) =>
                          handleShiftIdChange(
                            employeeId,
                            event.target.value,
                          )
                        }
                        placeholder="Existing shift ID"
                        value={
                          shiftIds[employeeId] ?? currentShiftId
                        }
                      />

                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                        onClick={() =>
                          handleShiftAssignment(employee)
                        }
                        type="button"
                      >
                        <CalendarClock className="h-4 w-4" />
                        Assign
                      </button>

                      {assignedShift && (
                        <button
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isPending}
                          onClick={() =>
                            handleShiftRemoval(employee)
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Background refresh indicator */}
        {isFetching && !isLoading && (
          <p className="border-t border-gray-100 px-5 py-2 text-xs text-gray-400">
            Updating employees...
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminShiftManager;
