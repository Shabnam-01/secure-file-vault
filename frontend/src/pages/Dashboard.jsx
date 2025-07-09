// Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ added state
  const location = useLocation();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/files/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ✅ Pass sidebar state to Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        {/* ✅ Pass sidebar state to TopNavigation */}
        <TopNavigation setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <Outlet context={{ stats, fetchStats }} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
