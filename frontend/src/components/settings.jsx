import React, { useEffect, useState } from "react";
import axios from "axios";
import { Shield, User, HardDrive, Trash2 } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const { setUser } = useContext(AuthContext);

  const [twoFA, setTwoFA] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/files/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettings(res.data);
        setTwoFA(res.data.twoFAEnabled);
        setFormData({
          username: res.data.user.username,
          email: res.data.user.email,
          password: "",
        });
      } catch (err) {
        console.error("Failed to load settings", err);
        alert("Failed to load settings. Please try again later.");
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/auth/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch updated info
      const res = await axios.get("http://localhost:5000/api/files/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user); // ✅ Updates the context and UI
      alert("Account updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. Please try again.");
    }
  };

  const disableTwoFA = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/settings/twofa",
        { enabled: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTwoFA(false);
      alert("Two-Factor Authentication disabled.");
      window.location.href = "/dashboard/2fa";
    } catch (err) {
      console.error("Error disabling 2FA", err);
      alert("Error disabling 2FA");
    }
  };

  if (!settings) return <div className="text-slate-400">Loading settings...</div>;

  const { storage } = settings;
  const usedGB = (storage.used / (1024 ** 3)).toFixed(2);
  const maxGB = (storage.max / (1024 ** 3)).toFixed(0);
  const percentUsed = ((storage.used / storage.max) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and security preferences</p>
      </div>

      <div className="grid gap-8">
        {/* SECURITY */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-green-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-slate-400 text-sm">Add an extra layer of security</p>
              </div>
              {twoFA ? (
                <button
                  onClick={disableTwoFA}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={() => (window.location.href = "/dashboard/2fa")}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"

                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Edit Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STORAGE */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <HardDrive className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Storage</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Storage Usage</span>
                <span className="text-slate-400">
                  {storage.used >= 1024 * 1024 * 1024
                    ? `${(storage.used / (1024 ** 3)).toFixed(2)} GB`
                    : `${(storage.used / (1024 ** 2)).toFixed(2)} MB`
                  }
                  {" / "}
                  {(storage.max / (1024 ** 3)).toFixed(0)} GB
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${((storage.used / storage.max) * 100).toFixed(1)}%` }}
                />
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
