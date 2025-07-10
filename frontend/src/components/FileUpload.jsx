import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, File, Shield, Lock } from "lucide-react";

const FileUpload = ({ onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    await uploadFiles(files);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("file", file);
    }

    try {
      await axios.post("https://vault-backend-edep.onrender.com/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (onUpload) onUpload();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Upload Files</h2>
        <p className="text-slate-400 text-sm">
          Securely store your files with AES-256 encryption
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        className={`relative bg-slate-800/40 backdrop-blur-xl border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:bg-slate-800/60 ${
          isDragOver
            ? "border-blue-400 bg-blue-500/10"
            : "border-slate-600 hover:border-slate-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full">
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">Drop files here</h3>
            <p className="text-slate-400 text-sm mt-1">or click to browse</p>
          </div>

          <button
            onClick={handleFileSelect}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            <File className="mr-2 h-4 w-4" />
            Choose Files
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex items-center text-sm text-slate-300">
          <Shield className="h-4 w-4 text-green-400 mr-2" />
          AES-256 Encryption
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Lock className="h-4 w-4 text-green-400 mr-2" />
          Zero-knowledge Architecture
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
