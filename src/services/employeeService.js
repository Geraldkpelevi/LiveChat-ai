import axiosInstance from "./axiosInstance";

// GET all employees
export const getEmployees = async () => {
  const response = await axiosInstance.get("/admin/employees");

  return response.data.data;
};

// PATCH employee system role
export const updateEmployeeRole = async (employeeId, role) => {
  const response = await axiosInstance.patch(
    `/admin/employees/${employeeId}/role`,
    { role }
  );

  return response.data;
};

// PATCH employee status
export const updateEmployeeStatus = async (employeeId, status) => {
  const response = await axiosInstance.patch(
    `/admin/employees/${employeeId}/status`,
    { status }
  );

  return response.data;
};

// DELETE employee
export const deleteEmployee = async (employeeId) => {
  const response = await axiosInstance.delete(`/admin/employees/${employeeId}`);

  return response.data;
};