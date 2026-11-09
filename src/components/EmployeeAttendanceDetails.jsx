import { useState } from "react";
import {
  X,
  Clock,
  CalendarDays,
  Coffee,
  Timer,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  BriefcaseBusiness,
} from "lucide-react";

import useEmployeeAttendanceHistory from "../hooks/useEmployeeAttendanceHistory";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (minutes = 0) => {
  const total = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(total / 60);
  const remainingMinutes = total % 60;

  return `${hours}h ${remainingMinutes}m`;
};

const getStatusStyle = (status) => {
  const styles = {
    ON_DUTY: "bg-green-100 text-green-700",
    ON_BREAK: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-gray-100 text-gray-700",
  };

  return styles[status] || "bg-gray-100 text-gray-600";
};

const getStatusLabel = (status) => {
  const labels = {
    ON_DUTY: "On Duty",
    ON_BREAK: "On Break",
    COMPLETED: "Completed",
  };

  return labels[status] || status || "Unknown";
};

const EmployeeAttendanceDetails = ({ employee, onClose }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const employeeId = employee?._id || employee?.id;

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useEmployeeAttendanceHistory({
    employeeId,
    page,
    limit,
  });

  const records = data?.records || [];
  const meta = data?.meta || {};

  const totalRecords = meta.totalRecords || 0;
  const totalPages = meta.totalPages || 1;

  const totalWorkedMinutes = records.reduce(
    (total, record) =>
      total + (Number(record.totalWorkedMinutes) || 0),
    0
  );

  const totalBreakMinutes = records.reduce(
    (total, record) =>
      total + (Number(record.totalBreakMinutes) || 0),
    0
  );

  const totalOvertimeMinutes = records.reduce(
    (total, record) =>
      total + (Number(record.shiftMetrics?.overtimeMinutes) || 0),
    0
  );

  const completedRecords = records.filter(
    (record) => record.status === "COMPLETED"
  ).length;

  const user = employee?.user || {};
  const shift = employee?.shift;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6">
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Employee attendance details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Attendance history, breaks, shift performance and overtime
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close employee details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {/* Employee information */}
          <div className="mb-6 rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name || employee?.name || "Unknown employee"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {user.email || employee?.email || "No email available"}
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {employee?.employeeNumber || "No employee number"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="text-gray-400" size={19} />
                <div>
                  <p className="text-xs text-gray-500">Job title</p>
                  <p className="text-sm font-medium text-gray-800">
                    {employee?.jobTitle || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={19} />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-800">
                    {employee?.department || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={19} />
                <div>
                  <p className="text-xs text-gray-500">Assigned shift</p>
                  <p className="text-sm font-medium text-gray-800">
                    {shift?.name || "No shift assigned"}
                    {shift?.startTime && shift?.endTime
                      ? ` (${shift.startTime} - ${shift.endTime})`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<CalendarDays size={19} />}
              label="Records on this page"
              value={records.length}
            />

            <SummaryCard
              icon={<Clock size={19} />}
              label="Worked time on this page"
              value={formatDuration(totalWorkedMinutes)}
            />

            <SummaryCard
              icon={<Coffee size={19} />}
              label="Break time on this page"
              value={formatDuration(totalBreakMinutes)}
            />

            <SummaryCard
              icon={<TrendingUp size={19} />}
              label="Overtime on this page"
              value={formatDuration(totalOvertimeMinutes)}
            />
          </div>

          {/* History */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Attendance history
              </h3>
              <p className="text-sm text-gray-500">
                {totalRecords} total attendance records
              </p>
            </div>

            {isFetching && (
              <span className="text-xs text-gray-500">
                Updating records...
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading attendance history...
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mb-2" size={20} />
              {error?.response?.data?.message ||
                "Unable to load this employee's attendance history."}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
              <CalendarDays className="mx-auto mb-2 text-gray-400" size={28} />
              <p className="text-sm font-medium text-gray-700">
                No attendance records found
              </p>
              <p className="mt-1 text-xs text-gray-500">
                This employee has no recorded attendance yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => {
                const metrics = record.shiftMetrics || {};
                const breaks = record.breaks || [];

                return (
                  <div
                    key={record._id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatDate(record.workDate || record.clockInTime)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Clocked in at {formatTime(record.clockInTime)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          record.status
                        )}`}
                      >
                        {getStatusLabel(record.status)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-4">
                      <DetailValue
                        label="Clock in"
                        value={formatTime(record.clockInTime)}
                      />

                      <DetailValue
                        label="Clock out"
                        value={formatTime(record.clockOutTime)}
                      />

                      <DetailValue
                        label="Worked time"
                        value={formatDuration(record.totalWorkedMinutes)}
                      />

                      <DetailValue
                        label="Break time"
                        value={formatDuration(record.totalBreakMinutes)}
                      />
                    </div>

                    {/* Break history */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Coffee size={16} className="text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-800">
                          Break history ({breaks.length})
                        </h4>
                      </div>

                      {breaks.length === 0 ? (
                        <p className="text-xs text-gray-500">
                          No breaks recorded.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {breaks.map((breakRecord, index) => (
                            <div
                              key={breakRecord._id || index}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs"
                            >
                              <span className="font-medium text-gray-700">
                                Break {index + 1}
                              </span>

                              <span className="text-gray-600">
                                {formatTime(
                                  breakRecord.startTime || breakRecord.startedAt
                                )}
                                {" – "}
                                {formatTime(
                                  breakRecord.endTime || breakRecord.endedAt
                                )}
                              </span>

                              <span className="font-medium text-gray-700">
                                {breakRecord.durationMinutes != null
                                  ? formatDuration(breakRecord.durationMinutes)
                                  : breakRecord.startTime && breakRecord.endTime
                                    ? formatDuration(
                                        Math.round(
                                          (new Date(breakRecord.endTime) -
                                            new Date(breakRecord.startTime)) /
                                            60000
                                        )
                                      )
                                    : "In progress"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Shift performance */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Timer size={16} className="text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-800">
                          Shift performance
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <DetailValue
                          label="Expected clock in"
                          value={metrics.expectedClockIn || "—"}
                        />

                        <DetailValue
                          label="Expected clock out"
                          value={metrics.expectedClockOut || "—"}
                        />

                        <DetailValue
                          label="Late arrival"
                          value={
                            metrics.isLate
                              ? formatDuration(metrics.lateMinutes)
                              : metrics.isLate === false
                                ? "On time"
                                : "Not available"
                          }
                        />

                        <DetailValue
                          label="Early departure"
                          value={
                            metrics.isEarlyDeparture
                              ? formatDuration(metrics.earlyDepartureMinutes)
                              : metrics.isEarlyDeparture === false
                                ? "No"
                                : "Not available"
                          }
                        />
                      </div>
                    </div>

                    {/* Overtime */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={17} className="text-blue-700" />
                        <span className="text-sm font-medium text-blue-900">
                          Overtime
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-blue-800">
                        {metrics.overtimeMinutes != null
                          ? formatDuration(metrics.overtimeMinutes)
                          : "Not calculated"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalRecords > 0 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} · {totalRecords} records
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((current) => current - 1)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((current) => current + 1)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="rounded-xl border border-gray-200 p-4">
    <div className="mb-3 flex items-center gap-2 text-gray-500">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-xl font-semibold text-gray-900">{value}</p>
  </div>
);

const DetailValue = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-800">{value ?? "—"}</p>
  </div>
);

export default EmployeeAttendanceDetails;