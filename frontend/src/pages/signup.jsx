import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://vault-backend-edep.onrender.com/api/auth/signup", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-green-400" />
          <h2 className="text-2xl font-bold text-white mt-2">Create Account</h2>
          <p className="text-slate-400 text-sm">Join SecureVault to protect your files</p>
        </div>

        <InputField
          icon={<User />}
          placeholder="Username"
          value={username}
          onChange={setUsername}
          type="text"
        />
        <InputField
          icon={<Mail />}
          placeholder="Email"
          value={email}
          onChange={setEmail}
          type="email"
        />
        <InputField
          icon={<Lock />}
          placeholder="Password"
          value={password}
          onChange={setPassword}
          type="password"
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 transition rounded text-white font-semibold"
        >
          Sign Up
        </button>

        <p className="text-slate-400 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 underline hover:text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

const InputField = ({ icon, placeholder, value, onChange, type = "text" }) => (
  <div className="relative">
    <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-400">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full py-2 pl-10 pr-3 rounded bg-slate-800/70 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

export default Signup;
