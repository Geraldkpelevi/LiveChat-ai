
import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  ChevronDown,
  UserRound,
  LockKeyhole,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import {
  getNavigationItems,
  getAccountNavigation,
} from "../../config/navigation";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  mobile = false,
  navigationItems,
  brand = {
    name: "LiveChat",
    subtitle: "AI workspace",
  },
}) {
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();

  // --------------------------------------------------
  // USER CONFIGURATION
  // --------------------------------------------------

  const userRole = user?.role;

  const selectedNavigation =
    navigationItems || getNavigationItems(userRole);

  const accountNavigation = getAccountNavigation(userRole);

  const initials =
    user?.initials ||
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    "U";

  // --------------------------------------------------
  // PROFILE DROPDOWN
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------

  const handleNavigate = () => {
    setProfileOpen(false);
    onNavigate?.();
  };

  const handleLogout = async () => {
    setProfileOpen(false);

    try {
      logout();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // --------------------------------------------------
  // PROFILE COMPONENT
  // --------------------------------------------------

  const ProfileMenu = () => (
    <div className="relative" ref={profileRef}>
      <button
        type="button"
        onClick={() => setProfileOpen((prev) => !prev)}
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        aria-label="Open account menu"
        title={collapsed ? `${user?.name || "User"} account` : undefined}
        className={`flex w-full min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-3 text-left transition hover:bg-gray-100 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
          {initials}
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.role || "Account"}
              </p>
            </div>

            <ChevronDown
              size={17}
              className={`shrink-0 text-gray-400 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {profileOpen && (
        <div
          role="menu"
          className={`absolute bottom-full z-50 mb-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl ${
            collapsed ? "left-full ml-2" : "left-0 right-0"
          }`}
        >
          <div className="border-b border-gray-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>

          <NavLink
            to={accountNavigation.personalDetails}
            role="menuitem"
            onClick={handleNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <UserRound size={17} />
            Personal Details
          </NavLink>

          <NavLink
            to={accountNavigation.changePassword}
            role="menuitem"
            onClick={handleNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <LockKeyhole size={17} />
            Change Password
          </NavLink>

          <div className="my-2 border-t border-gray-100" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );

  // --------------------------------------------------
  // SIDEBAR
  // --------------------------------------------------

  return (
    <aside
      className={`relative z-10 flex h-full min-h-0 shrink-0 flex-col border-r border-gray-200 bg-white shadow-xl transition-[width] duration-200 ${
        mobile ? "w-72 max-w-[85vw]" : collapsed ? "w-19" : "w-62"
      }`}
    >
      {/* BRAND */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-gray-100 ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <Sparkles size={21} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-gray-900">
                {brand.name}
              </h1>

              <p className="truncate text-xs text-gray-500">
                {brand.subtitle}
              </p>
            </div>
          )}
        </div>

        {mobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Close navigation menu"
            title="Close navigation menu"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* MAIN NAVIGATION */}
      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto p-3"
      >
        {!collapsed && (
          <p className="mb-3 px-3 pt-3 text-sm font-semibold uppercase tracking-[0.15em] text-gray-400">
            Workspace
          </p>
        )}

        {selectedNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.end ?? true}
              onClick={handleNavigate}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />

              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="shrink-0 rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ACCOUNT MENU */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <ProfileMenu/>
      </div>
    </aside>
  );
}
