import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./components/DashboardHome"; // 👈 Add this
import Uploads from "./components/Uploads";
import Settings from "./components/settings";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Main from "./pages/Main";
import RequireAuth from "./components/RequireAuth";
import TwoFASetup from "./pages/TwoFaSetup";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        {/* ✅ Index route for /dashboard */}
        <Route index element={<DashboardHome />} />

        {/* ✅ Nested routes for other tabs */}
        <Route path="uploads" element={<Uploads />} />
        <Route path="settings" element={<Settings />} />
        <Route path="2fa" element={<TwoFASetup />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<div className="text-white p-4">404 Not Found</div>} />
    </Routes>
  );
}

export default App;
