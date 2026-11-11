import axiosInstance from "./axiosInstance";

// Automatically detect whether the employee is using a mobile device.
const getDeviceSource = () => {
  if (typeof navigator === "undefined") return "WEB";

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    ? "MOBILE"
    : "WEB";
};

const TIME_CLOCK_URL = "/employee/time-clock";

const getResponseData = (response) => response.data.data;

export const timeClockService = {
  // Get current employee time-clock status
  getStatus: async () => {
    const response = await axiosInstance.get(`${TIME_CLOCK_URL}/status`);
    return getResponseData(response);
  },

  // Clock in
  clockIn: async () => {
    const response = await axiosInstance.post(`${TIME_CLOCK_URL}/clock-in`, {
      source: getDeviceSource(),
    });

    return getResponseData(response);
  },

  // Start break
  startBreak: async () => {
    const response = await axiosInstance.post(`${TIME_CLOCK_URL}/start-break`);
    return getResponseData(response);
  },

  // End break
  endBreak: async () => {
    const response = await axiosInstance.post(`${TIME_CLOCK_URL}/end-break`);
    return getResponseData(response);
  },

  // Clock out
  clockOut: async () => {
    const response = await axiosInstance.post(`${TIME_CLOCK_URL}/clock-out`, {
      source: getDeviceSource(),
    });

    return getResponseData(response);
  },

  adminClockIn: async (employeeId) => {
    const response = await axiosInstance.post(
      `/admin/employees/${employeeId}/clock-in`,
      { source: getDeviceSource() },
    );

    return getResponseData(response);
  },

  adminClockOut: async (employeeId) => {
    const response = await axiosInstance.post(
      `/admin/employees/${employeeId}/clock-out`,
      { source: getDeviceSource() },
    );

    return getResponseData(response);
  },

  assignShift: async (employeeId, shiftId) => {
    const response = await axiosInstance.patch(
      `/admin/employees/${employeeId}/shift`,
      { shiftId },
    );

    return getResponseData(response);
  },
};
