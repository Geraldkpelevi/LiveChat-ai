
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthSkeleton from "../components/AuthSkeleton";

const roleRedirects = {
  CUSTOMER: "/dashboard",
  AGENT: "/agent/dashboard",
  ADMIN: "/admin/dashboard",
};

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait until authentication has been verified
  if (isLoading) {
    return <AuthSkeleton />;
  }

  // Redirect unauthenticated users to signin
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  // Restrict access based on user role
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    const redirectPath = roleRedirects[user.role] || "/signin";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
