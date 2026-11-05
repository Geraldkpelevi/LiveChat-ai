
import { useCallback, useEffect, useState } from "react";

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

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getUsers({
        search: search.trim(),
        role: role || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });

      setUsers(result.users || []);
      setPagination(result.pagination || initialPagination);
    } catch (err) {
      setError(err.message || "Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [search, role, status, page]);

  // Debounced user fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Change user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      setActionLoading(true);

      await updateUserRole(userId, newRole);

      await fetchUsers();

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Change account status
  const handleUpdateStatus = async (userId, isActive) => {
    try {
      setActionLoading(true);

      await updateUserStatus(userId, isActive);

      await fetchUsers();

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Remove user
  const handleDeleteUser = async (userId) => {
    try {
      setActionLoading(true);

      await deleteUser(userId);

      await fetchUsers();

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Create agent
  const handleCreateAgent = async (agentData) => {
    try {
      setActionLoading(true);

      await createAgent(agentData);

      setPage(1);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

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

  return {
    users,
    pagination,

    search,
    role,
    status,
    page,

    loading,
    error,
    actionLoading,

    fetchUsers,

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
