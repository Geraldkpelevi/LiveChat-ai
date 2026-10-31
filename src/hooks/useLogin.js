import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleRedirects = {
  CUSTOMER: "/messages",
  AGENT: "/dashboard",
  ADMIN: "/dashboard",
};

function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (credentials, rememberMe) => {
    try {
      setIsLoading(true);
      setError("");

      const user = await login(credentials, rememberMe);

      const redirectPath = roleRedirects[user.role] || "/";

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login: handleLogin,
    isLoading,
    error,
  };
}

export default useLogin;