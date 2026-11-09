import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteEmployee,
  getEmployees,
  updateEmployeeRole,
  updateEmployeeStatus,
} from "../services/employeeService";

export const employeeKeys = {
  all: ["employees"],
  lists: () => [...employeeKeys.all, "list"],
};

// Fetch employees
export const useEmployees = () => {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: getEmployees,
  });
};

// Update employee system role
export const useUpdateEmployeeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, role }) => updateEmployeeRole(employeeId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      });
    },
  });
};

// Delete employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId) => deleteEmployee(employeeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      });
    },
  });
};

// Update employee status
export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, status }) =>
      updateEmployeeStatus(employeeId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      });
    },
  });
};
