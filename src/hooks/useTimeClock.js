import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timeClockService } from "../services/timeClockService";

const TIME_CLOCK_KEY = ["employee-time-clock"];

export const useTimeClock = () => {
  const queryClient = useQueryClient();

  // Refresh attendance status
  const {
    data: timeClockStatus,
    isLoading,
    isFetching,
    error: statusError,
    refetch,
  } = useQuery({
    queryKey: TIME_CLOCK_KEY,
    queryFn: timeClockService.getStatus,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  // Refresh status after every successful operation
  const invalidateTimeClock = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: TIME_CLOCK_KEY,
      }),
      queryClient.invalidateQueries({
        queryKey: ["admin", "active-attendance"],
      }),
    ]);

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: timeClockService.clockIn,
    onSuccess: invalidateTimeClock,
  });

  // Start break mutation
  const startBreakMutation = useMutation({
    mutationFn: timeClockService.startBreak,
    onSuccess: invalidateTimeClock,
  });

  // End break mutation
  const endBreakMutation = useMutation({
    mutationFn: timeClockService.endBreak,
    onSuccess: invalidateTimeClock,
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: timeClockService.clockOut,
    onSuccess: invalidateTimeClock,
  });

  const mutation = useMutation({
    mutationFn: ({ employeeId, shiftId }) =>
      timeClockService.assignShift(employeeId, shiftId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employees", "list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee-time-clock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee", variables.employeeId],
      });
    },
  });

  return {
    timeClockStatus,

    isLoading,
    isFetching,
    statusError,

    clockIn: clockInMutation.mutateAsync,
    startBreak: startBreakMutation.mutateAsync,
    endBreak: endBreakMutation.mutateAsync,
    clockOut: clockOutMutation.mutateAsync,

    isClockingIn: clockInMutation.isPending,
    isStartingBreak: startBreakMutation.isPending,
    isEndingBreak: endBreakMutation.isPending,
    isClockingOut: clockOutMutation.isPending,

    clockInError: clockInMutation.error,
    startBreakError: startBreakMutation.error,
    endBreakError: endBreakMutation.error,
    clockOutError: clockOutMutation.error,
assignShift: mutation.mutateAsync,
    isAssigning: mutation.isPending,
    assignShiftError: mutation.error,
    refetch,
  };
};
