
import { useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  createAgent,
} from "../services/userService";

const initialPagination = {
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  pageLimit: 10,
};

const USERS_QUERY_KEY = ["admin", "users"];

const useUsers = () => {
  const queryClient = useQueryClient();

  // Local UI state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionError, setActionError] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users
  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      ...USERS_QUERY_KEY,
      {
        search: debouncedSearch,
        role,
        status,
        page,
        limit: 10,
      },
    ],

    queryFn: () =>
      getUsers({
        search: debouncedSearch,
        role: role || undefined,
        status: status || undefined,
        page,
        limit: 10,
      }),

    placeholderData: (previousData) => previousData,
  });

  const users = data?.users || [];

  const pagination = data?.pagination || initialPagination;

  // Refresh users after successful operations
  const invalidateUsers = () =>
    queryClient.invalidateQueries({
      queryKey: USERS_QUERY_KEY,
    });

  // Update user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) =>
      updateUserRole(userId, newRole),

    onSuccess: invalidateUsers,
  });

  // Update account status
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }) =>
      updateUserStatus(userId, isActive),

    onSuccess: invalidateUsers,
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),

    onSuccess: invalidateUsers,
  });

  // Create agent
  const createAgentMutation = useMutation({
    mutationFn: (agentData) => createAgent(agentData),

    onSuccess: async () => {
      setPage(1);
      await invalidateUsers();
    },
  });

  // Handle mutation errors consistently
  const executeMutation = async (mutation, variables) => {
    try {
      setActionError("");

      await mutation.mutateAsync(variables);

      return true;
    } catch (err) {
      setActionError(err.message || "Something went wrong.");

      return false;
    }
  };

  // Change user role
  const handleUpdateRole = (userId, newRole) =>
    executeMutation(updateRoleMutation, {
      userId,
      newRole,
    });

  // Change account status
  const handleUpdateStatus = (userId, isActive) =>
    executeMutation(updateStatusMutation, {
      userId,
      isActive,
    });

  // Remove user
  const handleDeleteUser = (userId) =>
    executeMutation(deleteUserMutation, userId);

  // Create agent
  const handleCreateAgent = (agentData) =>
    executeMutation(createAgentMutation, agentData);

  // Search and filters
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilter = (value) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleRefreshUsers = () => {
    const alreadyUnfiltered =
      !debouncedSearch && !role && !status && page === 1;

    setSearch("");
    setDebouncedSearch("");
    setRole("");
    setStatus("");
    setPage(1);

    if (alreadyUnfiltered) {
      return refetch();
    }
  };

  // Pagination
  const nextPage = () => {
    setPage((current) =>
      Math.min(current + 1, pagination.totalPages)
    );
  };

  const previousPage = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  const goToPage = (value) => {
    setPage(
      Math.max(1, Math.min(value, pagination.totalPages))
    );
  };

  // Combined mutation loading state
  const actionLoading =
    updateRoleMutation.isPending ||
    updateStatusMutation.isPending ||
    deleteUserMutation.isPending ||
    createAgentMutation.isPending;
  const roleUpdatingUserId = updateRoleMutation.isPending
    ? updateRoleMutation.variables?.userId
    : null;
  const statusUpdatingUserId = updateStatusMutation.isPending
    ? updateStatusMutation.variables?.userId
    : null;

  return {
    users,
    pagination,

    search,
    role,
    status,
    page,

    loading: isLoading,
    isFiltering:
      (isFetching && !isLoading) ||
      search.trim() !== debouncedSearch,
    error: actionError || queryError?.message || "",
    actionLoading,
    roleUpdatingUserId,
    statusUpdatingUserId,

    fetchUsers: refetch,
    handleRefreshUsers,

    handleSearch,
    handleRoleFilter,
    handleStatusFilter,

    handleUpdateRole,
    handleUpdateStatus,
    handleDeleteUser,
    handleCreateAgent,

    nextPage,
    previousPage,
    goToPage,
  };
};

export default useUsers;
