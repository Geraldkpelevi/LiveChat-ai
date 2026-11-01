import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  AtSign,
  ShieldCheck,
  CalendarDays,
  LogOut,
  Edit,
  ArrowLeft,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName =
    user?.name ||
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  const profileDetails = [
    {
      label: "Full Name",
      value: fullName,
      icon: User,
    },
    {
      label: "Username",
      value: user?.username || "Not provided",
      icon: AtSign,
    },
    {
      label: "Email Address",
      value: user?.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Account Role",
      value: user?.role || "User",
      icon: ShieldCheck,
    },
    {
      label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "Not available",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your personal account information.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Profile Banner */}
          <div className="h-32 bg-linear-to-r from-indigo-700 to-violet-800 sm:h-40" />
          <div className="px-5 pb-6 sm:px-8">

            {/* Avatar */}
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-700 shadow-sm sm:h-28 sm:w-28">
                  {initials}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="pb-1">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active Account
                </span>
              </div>
            </div>

            {/* Account Details */}
            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your registered account details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {profileDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2 text-gray-400">
                        <Icon size={17} />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </div>

                      <p className="wrap-break-word text-sm font-semibold text-gray-800">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Account Settings
              </h3>

              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled
                  title="Profile editing is not implemented yet"
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-400"
                >
                  <Edit size={17} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your account information is securely managed by ReplyMate AI.
        </p>
      </div>
    </div>
  );
}