import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_URL ||
  "https://livechat-ai-backend-1.onrender.com/api"
).replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
