import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

const getStoredToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const saveSession = (token, user, rememberMe = true) => {
  // Clear previous session
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("token", token);
  storage.setItem("user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore and validate an existing session
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(storedToken);

        setToken(storedToken);
        setUser(currentUser);

        // Refresh stored profile with the backend's latest user data
        const storage = localStorage.getItem("token")
          ? localStorage
          : sessionStorage;

        storage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login
  const login = useCallback(async (credentials, rememberMe = true) => {
    const { user: authenticatedUser, token: accessToken } =
      await loginUser(credentials);

    saveSession(accessToken, authenticatedUser, rememberMe);

    setToken(accessToken);
    setUser(authenticatedUser);

    return authenticatedUser;
  }, []);

  // Signup
  const signup = useCallback(async (userData) => {
    const { user: authenticatedUser, token: accessToken } =
      await registerUser(userData);

    // New customer registrations use a persistent session
    saveSession(accessToken, authenticatedUser, true);

    setToken(accessToken);
    setUser(authenticatedUser);

    return authenticatedUser;
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Shared authentication hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};