import { Navigate, Route, Routes } from "react-router-dom";

import Signin from "../auth/Signin";
import Signup from "../auth/Signup";
import AppLayout from "../layouts/AppLayout";
import AIAssistant from "../pages/AIAssistant";
import Contacts from "../pages/Contacts";
import Dashboad from "../pages/Dashboad";
import Messages from "../pages/Messages";
import NotFound from "../pages/NotFound";
import Settings from "../pages/Settings";

import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Navigate to="/signin" replace />} />

      {/* Protected customer routes */}
      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboad />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}