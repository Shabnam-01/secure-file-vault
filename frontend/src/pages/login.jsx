import { useState } from "react";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://vault-backend-edep.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (res.data.requires2FA) {
        setRequires2FA(true);
        setUserId(res.data.userId);
        alert("Please enter your 2FA code.");
      } else {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const handleVerify2FA = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify2fa-login", {
        token: otpCode,
        userId,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Invalid 2FA code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <ShieldCheck className="mx-auto h-12 w-12 text-green-400" />
          <h2 className="text-2xl font-bold text-white mt-2">Secure Vault</h2>
          <p className="text-slate-400 text-sm">Log in to your encrypted space</p>
        </div>

        {!requires2FA ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField icon={<Mail />} placeholder="Email" value={email} onChange={setEmail} type="email" />
            <InputField icon={<Lock />} placeholder="Password" value={password} onChange={setPassword} type="password" />
            <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 transition rounded text-white font-semibold">
              Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <InputField icon={<ShieldCheck />} placeholder="Enter 2FA Code" value={otpCode} onChange={setOtpCode} />
            <button
              onClick={handleVerify2FA}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white font-semibold"
            >
              Verify 2FA
            </button>
          </div>
        )}
      </div>
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

export default Login;
