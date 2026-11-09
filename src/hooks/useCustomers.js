
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomers,
  updateCustomerStatus,
  deleteCustomer,
} from "../services/customersService";

const initialPagination = {
  totalCustomers: 0,
  currentPage: 1,
  totalPages: 1,
  pageLimit: 10,
};

const useCustomers = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const queryParams = {
    page,
    limit: initialPagination.pageLimit,
    search,
    status,
  };

  // Fetch customers
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers", queryParams],
    queryFn: () => getCustomers(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const customers = data?.customers || [];

  const pagination = {
    ...initialPagination,
    ...(data?.pagination || {}),
  };

  // Update customer account status
  const updateStatusMutation = useMutation({
    mutationFn: ({ customerId, isActive }) =>
      updateCustomerStatus(customerId, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });

  // Delete customer
  const deleteCustomerMutation = useMutation({
    mutationFn: (customerId) => deleteCustomer(customerId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleRefreshCustomers = () => {
    setSearch("");
    setStatus("");
    setPage(1);

    queryClient.invalidateQueries({
      queryKey: ["customers"],
    });
  };

  const handleUpdateStatus = async (customerId, isActive) => {
    try {
      await updateStatusMutation.mutateAsync({
        customerId,
        isActive,
      });

      return true;
    } catch (error) {
      console.error("Customer status update failed:", error);
      return false;
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomerMutation.mutateAsync(customerId);

      // Move back one page if the last customer on this page was deleted.
      if (customers.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      return true;
    } catch (error) {
      console.error("Customer deletion failed:", error);
      return false;
    }
  };

  const nextPage = () => {
    if (page < pagination.totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    const validPage = Math.max(
      1,
      Math.min(pageNumber, pagination.totalPages)
    );

    setPage(validPage);
  };

  const actionLoading =
    updateStatusMutation.isPending ||
    deleteCustomerMutation.isPending;

  return {
    customers,
    pagination,

    search,
    status,
    page,

    loading: isLoading,
    isFiltering: isFetching && !isLoading,
    error: error?.message || null,
    actionLoading,

    statusUpdatingCustomerId:
      updateStatusMutation.variables?.customerId || null,

    deletingCustomerId:
      deleteCustomerMutation.variables || null,

    fetchCustomers: refetch,
    handleRefreshCustomers,
    handleSearch,
    handleStatusFilter,
    handleUpdateStatus,
    handleDeleteCustomer,

    nextPage,
    previousPage,
    goToPage,
  };
};

export default useCustomers;
