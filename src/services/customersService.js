
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

// Fetch all customers
export const getCustomers = (params = {}) =>
  request(
    axiosInstance.get("/admin/customers", { params }),
    "Unable to fetch customers."
  );

// Fetch customer by ID
export const getCustomerById = (customerId) =>
  request(
    axiosInstance.get(`/admin/customers/${customerId}`),
    "Unable to fetch customer."
  );

// Activate or deactivate customer
export const updateCustomerStatus = (customerId, isActive) =>
  request(
    axiosInstance.patch(`/admin/customers/${customerId}/status`, {
      isActive,
    }),
    "Unable to update customer status."
  );

// Delete customer
export const deleteCustomer = (customerId) =>
  request(
    axiosInstance.delete(`/admin/customers/${customerId}`),
    "Unable to delete customer."
  );
