import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
const TwoFASetup = () => {
  const [qrData, setQrData] = useState(null);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [tempSecret, setTempSecret] = useState("");


  const enable2FA = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.post("https://vault-backend-edep.onrender.com/api/auth/enable2fa", {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

  setQrData(res.data);
  setTempSecret(res.data.base32);
};


  const verify2FA = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post("http://localhost:5000/api/auth/verify2fa-setup",
      {
        token: code,
        tempSecret
      },
      { headers: { Authorization: `Bearer ${token}` } });

    if (res.data.success) {
      setVerified(true);
      alert("2FA setup complete!");
      window.location.href = "/dashboard/settings";
    } else {
      alert("Invalid code");
    }
  } catch (err) {
    console.error("❌ AxiosError", err.response?.data || err.message);
    alert("Verification failed: " + (err.response?.data?.message || err.message));
  }
};




  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl mb-4">Two-Factor Authentication Setup</h1>
      {!qrData ? (
        <button
          onClick={enable2FA}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Enable 2FA
        </button>
      ) : (
        <div>
          <p>Scan this QR code:</p>
          <QRCodeCanvas value={qrData.otpauth_url} size={200} includeMargin={true} />
          <p className="mt-4 text-gray-400 text-sm">
            Or manually enter secret: <span className="font-mono">{qrData.base32}</span>
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-3 py-2 bg-slate-700 text-white rounded"
            />
            <button
              onClick={verify2FA}
              className="ml-2 bg-blue-600 px-4 py-2 rounded"
            >
              Verify
            </button>
          </div>
          {verified && <p className="text-green-500 mt-2">2FA setup complete!</p>}
        </div>
      )}
    </div>
  );
};

export default TwoFASetup;
