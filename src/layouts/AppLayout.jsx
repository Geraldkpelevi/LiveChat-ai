
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import Sidebar from "../components/layouts/Sidebar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-gray-50">
      <div
        className="hidden h-full shrink-0 lg:flex"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((previous) => !previous)}
        />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-950/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <Sidebar
            mobile
            collapsed={false}
            onToggleCollapse={() => setMobileSidebarOpen(false)}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 sm:px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileSidebarOpen}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Menu size={20} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Sparkles size={19} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">LiveChat</p>
            <p className="truncate text-[11px] text-gray-500">AI workspace</p>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
