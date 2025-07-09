import React from "react";
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      {/* Sidebar takes up fixed width */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:w-64">
        <TopNavigation />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
