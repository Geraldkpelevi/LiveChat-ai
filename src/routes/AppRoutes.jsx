import { Navigate, Route, Routes } from "react-router-dom";

// Authentication
import EmployeeRegistration from "../auth/EmployeeRegistration";
import Signin from "../auth/Signin";
import Signup from "../auth/Signup";

// Layout
import AppLayout from "../layouts/AppLayout";
// employee pages
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

// Customer pages
import ChangePassword from "../components/ChangePassword";
import AIAssistant from "../pages/AIAssistant";
import Contacts from "../pages/Contacts";
import Home from "../pages/dashboard/Home";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
// Admin pages
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import AdminEmployeesPage from "../pages/admin/AdminEmployeesPage";
import AdminSettings from "../pages/admin/AdminSettings";
import Customersettings from "../pages/customers/Settings";
import AdminAttendanceTable from "../pages/admin/AdminAttendanceTable";

// Routes
import ProtectedRoute from "../routes/ProtectedRoute";

// Other
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/employee/register" element={<EmployeeRegistration />} />
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

      {/* ================= EMPLOYEE ROUTES ================= */}

      <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/employee/dashboard" element={<Home />} />
          <Route path="/employee/profile" element={<Profile />} />
          <Route path="/employee/time-clock" element={<EmployeeDashboard />} />
          <Route
            path="/employee/change-password"
            element={<ChangePassword />}
          />
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
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/employees" element={<AdminEmployeesPage />} />
          <Route path="/admin/attendance-table" element={<AdminAttendanceTable  />} />
          <Route
            path="/admin/customers-list"
            element={<AdminCustomersPage />}
          />
        </Route>
      </Route>

      {/* ================= ADMIN DEFAULT ROUTE ================= */}

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route element={<ProtectedRoute allowedRoles={["AGENT"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/agent/dashboard" element={<Home />} />
          <Route path="/agent/profile" element={<Profile />} />
          <Route path="/agent/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* ================= NOT FOUND ================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
