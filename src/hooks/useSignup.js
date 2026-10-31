import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function useSignup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (userData) => {
    try {
      setIsLoading(true);
      setError("");

      const user = await signup(userData);

      if (user.role === "CUSTOMER") {
        navigate("/signin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup: handleSignup,
    isLoading,
    error,
  };
}

export default useSignup;