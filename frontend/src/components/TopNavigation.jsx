import React from "react";
import { Menu, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TopNavigation = ({ setSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  const avatarUrl = user
    ? `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(user.username)}`
    : `https://api.dicebear.com/6.x/initials/svg?seed=User`;

  return (
    <header className="bg-slate-900/30 backdrop-blur-xl">
      <div className="px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/50 lg:hidden mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-white whitespace-nowrap">Secure File Vault</h1>
            <div className="ml-3 flex items-center px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <Shield className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-xs text-green-400 font-medium">AES-256</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3">
            

            {/* Desktop View: Username + Email + Avatar */}
            <Link
              to="/dashboard/settings"
              className="hidden sm:flex items-center space-x-3 hover:opacity-80"
            >
              <div className="text-right max-w-[120px] overflow-hidden text-ellipsis">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full border border-slate-700"
              />
            </Link>

            {/* Mobile View: Avatar Only */}
            <Link
              to="/dashboard/settings"
              className="sm:hidden"
            >
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-blue-400 hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
