import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../services/attendanceService";

export const useActiveAttendance = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin", "active-attendance"],
    queryFn: attendanceService.getActiveEmployees,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  return {
    employees: data?.employees || [],
    totalOnDuty: data?.totalOnDuty || 0,
    totalOnBreak: data?.totalOnBreak || 0,
    totalOffDuty: data?.totalOffDuty || 0,
    totalActive: (data?.totalOnDuty || 0) + (data?.totalOnBreak || 0),

    isLoading,
    isFetching,
    error,
    refetch,
  };
};