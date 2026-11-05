
import axiosInstance from "./axiosInstance";

const getResultData = (result, fallbackMessage) => {
  if (!result?.success) {
    throw new Error(result?.message || fallbackMessage);
  }

  return result.data;
};

const getRequestError = (error, fallbackMessage) => {
  const message = error.response?.data?.message;

  if (typeof message === "string" && message) {
    return new Error(message);
  }

  if (error.response) {
    return new Error(fallbackMessage);
  }

  return error;
};

const request = async (apiRequest, fallbackMessage) => {
  try {
    const { data } = await apiRequest;
    return getResultData(data, fallbackMessage);
  } catch (error) {
    if (error instanceof Error && !error.response) {
      throw error;
    }

    throw getRequestError(error, fallbackMessage);
  }
};

// Fetch all users
export const getUsers = (params = {}) =>
  request(
    axiosInstance.get("/admin/users", { params }),
    "Unable to fetch users."
  );

// Update user role
export const updateUserRole = (userId, role) =>
  request(
    axiosInstance.patch(`/admin/users/${userId}/role`, {
      role,
    }),
    "Unable to update user role."
  );

// Activate or deactivate user
export const updateUserStatus = (userId, isActive) =>
  request(
    axiosInstance.patch(`/admin/users/${userId}/status`, {
      isActive,
    }),
    "Unable to update user status."
  );

// Delete user
export const deleteUser = (userId) =>
  request(
    axiosInstance.delete(`/admin/users/${userId}`),
    "Unable to delete user."
  );

// Create support agent
export const createAgent = (agentData) =>
  request(
    axiosInstance.post("/admin/agents", agentData),
    "Unable to create support agent."
  );
