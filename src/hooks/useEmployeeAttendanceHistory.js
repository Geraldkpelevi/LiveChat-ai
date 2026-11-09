import { useQuery } from "@tanstack/react-query";
import { getEmployeeAttendanceHistory } from "../services/attendanceService";

const useEmployeeAttendanceHistory = ({
  employeeId,
  page = 1,
  limit = 10,
  from,
  to,
}) => {
  return useQuery({
    queryKey: [
      "admin",
      "employee-attendance-history",
      employeeId,
      page,
      limit,
      from,
      to,
    ],
    queryFn: () =>
      getEmployeeAttendanceHistory({
        employeeId,
        page,
        limit,
        from,
        to,
      }),
    enabled: Boolean(employeeId),
    placeholderData: (previousData) => previousData,
  });
};

export default useEmployeeAttendanceHistory;