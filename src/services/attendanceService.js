import axiosInstance from "./axiosInstance";

export const attendanceService = {
  getActiveEmployees: async () => {
    const response = await axiosInstance.get("/admin/attendance", {
      params: {
        page: 1,
        limit: 100,
      },
    });

    const employees = response.data.data || [];
    const onDuty = employees.filter((record) => record.status === "ON_DUTY");
    const onBreak = employees.filter((record) => record.status === "ON_BREAK");
    const offDuty = employees.filter(
      (record) =>
        record.clockOutTime ||
        ["CLOCKED_OUT", "OFF_DUTY", "DUTY_ENDED", "COMPLETED"].includes(
          record.status,
        ),
    );

    employees.sort(
      (a, b) =>
        new Date(b.clockInTime) - new Date(a.clockInTime),
    );

    return {
      employees,
      totalOnDuty: onDuty.length,
      totalOnBreak: onBreak.length,
      totalOffDuty: offDuty.length,
    };
  },
};