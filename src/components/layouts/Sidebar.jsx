import { Sparkles, X } from "lucide-react";
import { navigationItems as defaultNavigationItems } from "../../config/navigation";
import { NavLink } from "react-router-dom";
export default function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  mobile = false,
  navigationItems = defaultNavigationItems,
  brand = {
    name: "LiveChat",
    subtitle: "AI workspace",
  },
  user = {
    name: "John Doe",
    role: "Workspace admin",
    initials: "JD",
  },
}) {
  return (
    <aside
      className={`relative z-10 flex h-full min-h-0 shrink-0 flex-col border-r border-gray-200 bg-white shadow-xl transition-[width] duration-200 ${
        mobile ? "w-72 max-w-[85vw]" : collapsed ? "w-19" : "w-62"
      }`}
    >
      {/* Brand */}
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

      {/* Navigation */}

      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto p-3"
      >
        {!collapsed && (
          <p className="mb-3 px-3 pt-3 text-sm font-semibold uppercase tracking-[0.15em] text-gray-400">
            Workspace
          </p>
        )}

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end
              onClick={onNavigate}
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
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>

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

      {/* User profile */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <div
          className={`flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-3 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? `${user.name} — ${user.role}` : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {user.initials}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-gray-800">
                {user.name}
              </p>
              <p className="truncate text-sm text-gray-500">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
