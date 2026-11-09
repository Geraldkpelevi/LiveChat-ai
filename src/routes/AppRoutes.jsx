import { Navigate, Route, Routes } from "react-router-dom";

// Authentication
import Signin from "../auth/Signin";
import Signup from "../auth/Signup";

// Layout
import AppLayout from "../layouts/AppLayout";

// Customer pages
import ChangePassword from "../components/ChangePassword";
import AIAssistant from "../pages/AIAssistant";
import Contacts from "../pages/Contacts";
import Home from "../pages/dashboard/Home";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
// Admin pages
import AdminSettings from "../pages/admin/AdminSettings";
import Customersettings from "../pages/customers/Settings";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";

import Users from "../pages/users/Users";

// Routes
import ProtectedRoute from "../routes/ProtectedRoute";

// Other
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Navigate to="/signin" replace />} />

      {/* ================= CUSTOMER ROUTES ================= */}

      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/aiassistant" element={<AIAssistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/customer-settings" element={<Customersettings />} />
        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<Home />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/contacts" element={<Contacts />} />
          <Route path="/admin/aiassistant" element={<AIAssistant />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="/admin/customers-list" element={<AdminCustomersPage />} />
        </Route>
      </Route>

      {/* ================= ADMIN DEFAULT ROUTE ================= */}

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route element={<ProtectedRoute allowedRoles={["AGENT"]} />}>
        <Route path="/agent/change-password" element={<ChangePassword />} />
      </Route>

      {/* ================= NOT FOUND ================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
