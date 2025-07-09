import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, CloudUpload, Download } from "lucide-react";

export default function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-12 flex flex-col items-center">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex items-center gap-3"
      >
        <Shield className="h-10 w-10 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">SecureVault</h1>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center max-w-xl"
      >
        <h2 className="text-4xl font-bold mb-4">Protect Your Files with Military-Grade Security</h2>
        <p className="text-lg text-slate-300 mb-6">
          Upload, encrypt, and manage your sensitive files in a zero-knowledge AES-256 vault.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full"
      >
        <FeatureCard
          icon={<Lock className="h-6 w-6 text-blue-400" />}
          title="End-to-End Encryption"
          desc="Your files are encrypted on upload and decrypted only for you."
        />
        <FeatureCard
          icon={<CloudUpload className="h-6 w-6 text-green-400" />}
          title="Secure Cloud Uploads"
          desc="Upload multiple files with drag & drop and manage them anytime."
        />
        <FeatureCard
          icon={<Download className="h-6 w-6 text-purple-400" />}
          title="Fast Downloads"
          desc="Easily access or share your encrypted files anytime you need."
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-yellow-400" />}
          title="Zero-Knowledge Privacy"
          desc="Only you hold the keys. No one else can see your data—not even us."
        />
      </motion.div>
    </div>
  );
}

// Reusable Feature Card
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 hover:shadow-lg transition duration-300">
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);
