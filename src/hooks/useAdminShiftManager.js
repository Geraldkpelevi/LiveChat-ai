
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllEmployees } from "../services/employeeService";
import { useAdminEmployeeShifts } from "./useAdminEmployeeShifts";

import {
  buildAttendanceMap,
  filterEmployees,
  getEmployeeId,
  getEmployeeName,
  getErrorMessage,
} from "../services/adminShiftManagerService";

export const ADMIN_SHIFT_MANAGER_QUERY_KEY = [
  "admin",
  "shift-manager-employees",
];

export const useAdminShiftManager = (attendanceRecords = []) => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [shiftIds, setShiftIds] = useState({});
  const [message, setMessage] = useState(null);
  const [clockingEmployeeId, setClockingEmployeeId] = useState(null);

  const {
    clockIn,
    clockOut,
    assignShift,
    isPending,
  } = useAdminEmployeeShifts();

  // Fetch employees
  const {
    data: employees = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ADMIN_SHIFT_MANAGER_QUERY_KEY,
    queryFn: getAllEmployees,
    staleTime: 60 * 1000,
  });

  // Build attendance lookup
  const attendanceByEmployee = useMemo(
    () => buildAttendanceMap(attendanceRecords),
    [attendanceRecords],
  );

  // Filter employees
  const filteredEmployees = useMemo(
    () =>
      filterEmployees(employees, search).filter((employee) => {
        const attendance = attendanceByEmployee.get(
          String(getEmployeeId(employee)),
        );

        if (statusFilter === "ON_DUTY") {
          return attendance?.status === "ON_DUTY";
        }

        if (statusFilter === "ON_BREAK") {
          return attendance?.status === "ON_BREAK";
        }

        if (statusFilter === "OFF_DUTY") {
          return !["ON_DUTY", "ON_BREAK"].includes(attendance?.status);
        }

        return true;
      }),
    [employees, search, statusFilter, attendanceByEmployee],
  );

  // Clear a temporary shift input
  const clearShiftInput = (employeeId) => {
    setShiftIds((previous) => {
      const next = { ...previous };
      delete next[employeeId];
      return next;
    });
  };

  // Shared action handler
  const runAction = async (action, successMessage) => {
    setMessage(null);

    try {
      await action();

      setMessage({
        type: "success",
        text: successMessage,
      });

      return true;
    } catch (actionError) {
      setMessage({
        type: "error",
        text: getErrorMessage(actionError),
      });

      return false;
    }
  };

  // Clock in / clock out
  const handleClockToggle = async (employee, isOnShift) => {
    const employeeId = getEmployeeId(employee);
    setClockingEmployeeId(String(employeeId));

    try {
      const success = await runAction(
        () =>
          isOnShift
            ? clockOut(employeeId)
            : clockIn(employeeId),
        `${getEmployeeName(employee)} was ${
          isOnShift ? "clocked out" : "clocked in"
        }.`,
      );

      if (success) {
        await queryClient.invalidateQueries({
          queryKey: ADMIN_SHIFT_MANAGER_QUERY_KEY,
        });
      }
    } finally {
      setClockingEmployeeId(null);
    }
  };

  // Assign shift
  const handleShiftAssignment = async (employee) => {
    const employeeId = getEmployeeId(employee);
    const shiftId = shiftIds[employeeId]?.trim();

    if (!shiftId) {
      setMessage({
        type: "error",
        text: "Enter an existing shift ID.",
      });
      return;
    }

    const success = await runAction(
      () => assignShift({ employeeId, shiftId }),
      `Shift assigned to ${getEmployeeName(employee)}.`,
    );

    if (success) {
      clearShiftInput(employeeId);

      await queryClient.invalidateQueries({
        queryKey: ADMIN_SHIFT_MANAGER_QUERY_KEY,
      });
    }
  };

  // Remove assigned shift
  const handleShiftRemoval = async (employee) => {
    const employeeId = getEmployeeId(employee);
    const employeeName = getEmployeeName(employee);

    if (
      !window.confirm(
        `Remove the assigned shift from ${employeeName}?`,
      )
    ) {
      return;
    }

    const success = await runAction(
      () => assignShift({ employeeId, shiftId: null }),
      `Assigned shift removed from ${employeeName}.`,
    );

    if (success) {
      clearShiftInput(employeeId);

      await queryClient.invalidateQueries({
        queryKey: ADMIN_SHIFT_MANAGER_QUERY_KEY,
      });
    }
  };

  const handleShiftIdChange = (employeeId, value) => {
    setShiftIds((previous) => ({
      ...previous,
      [employeeId]: value,
    }));
  };

  return {
    // Data
    employees,
    filteredEmployees,
    attendanceByEmployee,

    // Search
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    // Shift inputs
    shiftIds,
    handleShiftIdChange,

    // Notifications
    message,
    setMessage,

    // Query states
    isLoading,
    isFetching,
    error,
    refetch,

    // Mutation state
    isPending,
    clockingEmployeeId,

    // Actions
    handleClockToggle,
    handleShiftAssignment,
    handleShiftRemoval,
  };
};
