
export const getEmployeeId = (employee) =>
  employee?._id || employee?.id;

export const getEmployeeName = (employee) =>
  employee?.user?.name || employee?.name || "Unknown Employee";

export const getEmployeeRole = (employee) =>
  employee?.user?.role || employee?.role || "USER";

export const getEmployeeShift = (employee) => {
  const shift = employee?.shift;

  if (!shift) return null;

  return typeof shift === "object" ? shift : { _id: shift };
};

export const getAttendanceEmployeeId = (record) => {
  const employee = record?.employee;

  return typeof employee === "object"
    ? getEmployeeId(employee)
    : employee;
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "The action failed.";

/**
 * Creates a map containing the latest attendance
 * record for each employee.
 */
export const buildAttendanceMap = (attendanceRecords = []) => {
  const attendance = new Map();

  const sortedRecords = [...attendanceRecords].sort(
    (a, b) =>
      new Date(b.clockInTime) - new Date(a.clockInTime),
  );

  sortedRecords.forEach((record) => {
    const employeeId = getAttendanceEmployeeId(record);

    if (employeeId && !attendance.has(String(employeeId))) {
      attendance.set(String(employeeId), record);
    }
  });

  return attendance;
};

/**
 * Filters employees using name, email,
 * employee number, and role.
 */
export const filterEmployees = (employees = [], search = "") => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) return employees;

  return employees.filter((employee) =>
    [
      getEmployeeName(employee),
      employee?.user?.email,
      employee?.employeeNumber,
      employee?.department,
      getEmployeeRole(employee),
      getEmployeeShift(employee)?.name,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(normalizedSearch),
      ),
  );
};

/**
 * Determines whether an employee is currently
 * on duty or on break.
 */
export const isEmployeeOnShift = (attendance) =>
  ["ON_DUTY", "ON_BREAK"].includes(attendance?.status);
