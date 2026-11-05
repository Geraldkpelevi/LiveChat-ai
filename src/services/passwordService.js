
import axiosInstance from "./axiosInstance";

export const changePasswordService = async (passwordData) => {
  const response = await axiosInstance.patch(
    "/auth/change-password",
    passwordData
  );

  return response.data;
};
