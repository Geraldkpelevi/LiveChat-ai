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

const requestAuth = async (request, fallbackMessage) => {
  try {
    const { data } = await request;
    return getResultData(data, fallbackMessage);
  } catch (error) {
    if (error instanceof Error && !error.response) {
      throw error;
    }

    throw getRequestError(error, fallbackMessage);
  }
};

export const loginUser = (credentials) =>
  requestAuth(
    axiosInstance.post("/auth/login", credentials),
    "Unable to sign in."
  );

export const registerUser = (userData) =>
  requestAuth(
    axiosInstance.post("/auth/register", userData),
    "Unable to create your account."
  );

export const getCurrentUser = (token) =>
  requestAuth(
    axiosInstance.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    "Unable to verify your session."
  ).then((data) => data.user);
