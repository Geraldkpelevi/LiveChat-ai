import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timeClockService } from "../services/timeClockService";

export const useAdminEmployeeShifts = () => {
  const queryClient = useQueryClient();

  const invalidateAttendance = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin", "active-attendance"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["admin", "shift-manager-employees"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      }),
    ]);

  const clockInMutation = useMutation({
    mutationFn: timeClockService.adminClockIn,
    onSuccess: invalidateAttendance,
  });

  const clockOutMutation = useMutation({
    mutationFn: timeClockService.adminClockOut,
    onSuccess: invalidateAttendance,
  });

  const assignMutation = useMutation({
    mutationFn: ({ employeeId, shiftId }) =>
      timeClockService.assignShift(employeeId, shiftId),
    onSuccess: invalidateAttendance,
  });

  return {
    clockIn: clockInMutation.mutateAsync,
    clockOut: clockOutMutation.mutateAsync,
    assignShift: assignMutation.mutateAsync,
    isPending:
      clockInMutation.isPending ||
      clockOutMutation.isPending ||
      assignMutation.isPending,
  };
};
