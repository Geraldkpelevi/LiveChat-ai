import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  LogIn,
  LogOut,
  Pause,
  Play,
  RefreshCw,
  Timer,
} from "lucide-react";
import { useState } from "react";

import { useTimeClock } from "../hooks/useTimeClock";
import EmployeeDashboardSkeleton from "./EmployeeDashboardSkeleton";
import formatDuration from "../utils/formatDuration";

const formatTime = (date) => {
  if (!date) return "--:--";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatWorkTime = (value) => {
  if (typeof value === "string") {
    const formattedDuration = value.match(
      /^(\d+)h(?:\.(\d+)m)?(?:\.(\d+)s)?$/,
    );

    if (formattedDuration) {
      const [, hours, minutes = "0", seconds = "0"] = formattedDuration;

      return formatDuration(
        Number(hours) * 60 + Number(minutes) + Number(seconds) / 60,
      );
    }
  }

  return formatDuration(value);
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const TimeClock = () => {
  const {
    timeClockStatus,
    isLoading,
    isFetching,
    statusError,

    clockIn,
    startBreak,
    endBreak,
    clockOut,

    isClockingIn,
    isStartingBreak,
    isEndingBreak,
    isClockingOut,

    refetch,
  } = useTimeClock();

  const [notification, setNotification] = useState(null);

  // Accommodate either a direct attendance response or a nested response.
  const attendance =
    timeClockStatus?.attendance ||
    timeClockStatus?.currentAttendance ||
    timeClockStatus;

  const status = attendance?.status;

  const isOnDuty = status === "ON_DUTY";
  const isOnBreak = status === "ON_BREAK";
  const hasClockedOut = status === "CLOCKED_OUT";

  const isWorking = isOnDuty || isOnBreak;

  const isBusy =
    isClockingIn || isStartingBreak || isEndingBreak || isClockingOut;

  const handleAction = async (action, successMessage) => {
    setNotification(null);

    try {
      await action();

      setNotification({
        type: "success",
        message: successMessage,
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };

  const handleClockIn = () =>
    handleAction(clockIn, "You have successfully clocked in.");

  const handleStartBreak = () =>
    handleAction(startBreak, "Your break has started.");

  const handleEndBreak = () => handleAction(endBreak, "Your break has ended.");

  const handleClockOut = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clock out for today?",
    );

    if (!confirmed) return;

    handleAction(clockOut, "You have successfully clocked out.");
  };

  if (isLoading) {
    return <EmployeeDashboardSkeleton />;
  }

  if (statusError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">
            Unable to retrieve your attendance status.
          </p>
        </div>

        <p className="mt-2 text-sm text-red-500">
          {getErrorMessage(statusError)}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const statusConfig = {
    ON_DUTY: {
      label: "On Duty",
      color: "bg-green-100 text-green-700",
      indicator: "bg-green-500",
    },
    ON_BREAK: {
      label: "On Break",
      color: "bg-amber-100 text-amber-700",
      indicator: "bg-amber-500",
    },
    CLOCKED_OUT: {
      label: "Clocked Out",
      color: "bg-gray-100 text-gray-600",
      indicator: "bg-gray-400",
    },
  };

  const currentStatus = statusConfig[status] || {
    label: "Not Clocked In",
    color: "bg-gray-100 text-gray-600",
    indicator: "bg-gray-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Time Clock
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your daily working hours and breaks.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            notification.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}

          <p className="text-sm font-medium">{notification.message}</p>

          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Attendance Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Current Attendance Status
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${currentStatus.indicator}`}
              />

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${currentStatus.color}`}
              >
                {currentStatus.label}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">Work Date</p>

            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-800 sm:justify-end">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              {attendance?.workDate || "Not available"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Timezone: {attendance?.timezone || "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Time Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Clock In</p>
              <h3 className="mt-1 text-xl font-semibold text-gray-900">
                {formatTime(attendance?.clockInTime)}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-3">
              <Timer className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Worked</p>
              <h3 className="mt-1 text-xl font-semibold text-gray-900">
                {formatWorkTime(
                  attendance?.totalWorkedTimeFormatted ??
                    attendance?.totalWorkedMinutes,
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-3">
              <Coffee className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Break</p>
              <h3 className="mt-1 text-xl font-semibold text-gray-900">
                {formatDuration(attendance?.totalBreakMinutes)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Time Clock Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="font-semibold text-gray-900">Manage Your Shift</h3>

        <p className="mt-1 text-sm text-gray-500">
          Select the appropriate action to update your attendance.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Clock In */}
          <button
            onClick={handleClockIn}
            disabled={isBusy || isWorking || hasClockedOut}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <LogIn className="h-5 w-5" />
            {isClockingIn ? "Clocking In..." : "Clock In"}
          </button>

          {/* Start Break */}
          <button
            onClick={handleStartBreak}
            disabled={isBusy || !isOnDuty}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Pause className="h-5 w-5" />
            {isStartingBreak ? "Starting Break..." : "Start Break"}
          </button>

          {/* End Break */}
          <button
            onClick={handleEndBreak}
            disabled={isBusy || !isOnBreak}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Play className="h-5 w-5" />
            {isEndingBreak ? "Ending Break..." : "End Break"}
          </button>

          {/* Clock Out */}
          <button
            onClick={handleClockOut}
            disabled={isBusy || !isWorking}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <LogOut className="h-5 w-5" />
            {isClockingOut ? "Clocking Out..." : "Clock Out"}
          </button>
        </div>

        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

            <p className="text-sm leading-6 text-gray-500">
              {isOnDuty &&
                "You are currently on duty. Remember to start your break when needed and clock out when your shift is complete."}

              {isOnBreak &&
                "You are currently on break. End your break before continuing your working hours."}

              {hasClockedOut &&
                "You have completed your shift for today. Your attendance has been recorded."}

              {!status &&
                "You have not clocked in yet. Clock in to begin recording your working hours."}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Details */}
      {attendance?.clockOutTime && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">
            Completed Shift Details
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Clock Out Time</p>
              <p className="mt-1 font-semibold text-gray-800">
                {formatTime(attendance.clockOutTime)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Clock Out Source</p>
              <p className="mt-1 font-semibold text-gray-800">
                {attendance.clockOutSource || "Not available"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeClock;
