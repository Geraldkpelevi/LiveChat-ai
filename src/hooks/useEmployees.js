import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  registerEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployeeRole,
  updateEmployeeStatus,
} from "../services/employeeService";

export const employeeKeys = {
  all: ["employees"],
  lists: () => [...employeeKeys.all, "list"],
};


export const useEmployeeRegistration = () => {
  const {
    mutate: register,
    mutateAsync: registerAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    reset,
  } = useMutation({
    mutationFn: registerEmployee,
  });

  return {
    register,
    registerAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    reset,
  };
};

// Fetch a page of employees
export const useEmployees = ({ page = 1, limit = 10, status = "" } = {}) => {
  return useQuery({
    queryKey: [...employeeKeys.lists(), { page, limit, status }],
    queryFn: () => getEmployees({ page, limit, status }),
    placeholderData: (previousData) => previousData,
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
