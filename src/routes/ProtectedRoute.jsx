import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthSkeleton from "../components/AuthSkeleton";

const roleRedirects = {
  CUSTOMER: "/chat",
  AGENT: "/agent/dashboard",
  ADMIN: "/admin/dashboard",
};

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectPath = roleRedirects[user.role] || "/signin";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;