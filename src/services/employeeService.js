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

export const getAllEmployees = async () => {
  const limit = 100;
  const employees = [];
  let page = 1;
  let totalPages;

  do {
    const result = await getEmployees({ page, limit });
    employees.push(...result.employees);

    const pageCount = Number(result.pagination.totalPages);
    const totalRecords = Number(result.pagination.totalRecords);
    const pageLimit = Number(result.pagination.pageLimit);

    totalPages =
      Number.isFinite(pageCount) && pageCount > 0
        ? pageCount
        : Number.isFinite(totalRecords) && totalRecords > 0 && pageLimit > 0
          ? Math.ceil(totalRecords / pageLimit)
          : undefined;

    if (totalPages === undefined && result.employees.length < limit) {
      break;
    }

    page += 1;
  } while (totalPages === undefined || page <= totalPages);

  return employees;
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