import axiosInstance from "./axiosInstance";



export const registerEmployee = async (employeeData) => {
  const response = await axiosInstance.post(
    "/employees/register",
    employeeData,
  );

  return response.data;
};
// GET paginated employees
export const getEmployees = async ({ page = 1, limit = 10, status } = {}) => {
  const params = { page, limit };

  if (status) {
    params.status = status;
  }

  const response = await axiosInstance.get("/admin/employees", { params });
  const result = response.data;

  return {
    employees: Array.isArray(result?.data) ? result.data : [],
    pagination: result?.meta || {},
  };
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