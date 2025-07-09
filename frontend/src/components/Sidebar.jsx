import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Settings,
  LogOut,
  Shield,
  X,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { id: "uploads", label: "Uploads", icon: Upload, to: "/dashboard/uploads" },
    { id: "settings", label: "Settings", icon: Settings, to: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <div className="flex flex-col flex-grow bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50">
          <div className="flex items-center h-16 px-6 border-b border-slate-700/50">
            <Shield className="h-8 w-8 text-blue-400 mr-3" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              SecureVault
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={`w-full border-transparent flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30 shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="px-4 pb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-opacity-40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700 z-50 p-4 overflow-y-auto lg:hidden transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">SecureVault</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-slate-400 hover:text-white" />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30 shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
