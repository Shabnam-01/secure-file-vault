import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Download,
  Trash2,
  File,
  Image,
  Video,
  Music,
  Archive,
  Shield,
} from "lucide-react";

const FileList = ({ refreshKey }) => {
  useEffect(() => {
    fetchFiles();
  }, [refreshKey]);
  const [files, setFiles] = useState([]);

  const token = localStorage.getItem("token");

  const downloadFile = async (id, filename) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/files/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",  // important!
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Download failed", err);
  }
};


  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(files.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "archive":
        return Archive;
      default:
        return File;
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case "image":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30";
      case "video":
        return "from-red-500/20 to-orange-500/20 border-red-500/30";
      case "audio":
        return "from-green-500/20 to-teal-500/20 border-green-500/30";
      case "archive":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      default:
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Your Files</h2>
        <p className="text-slate-400 text-sm">Manage your encrypted files</p>
      </div>

      <div className="space-y-4">
        {files.map((file) => {
          const fileType = file.filename.split(".").pop();
          const FileIcon = getFileIcon(fileType);
          const colorClass = getFileTypeColor(fileType);

          return (
            <div
              key={file._id}
              className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className={`p-3 bg-gradient-to-r ${colorClass} rounded-lg border`}>
                    <FileIcon className="h-5 w-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium truncate">
                        {file.filename}
                      </h3>
                      <div className="flex items-center px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <Shield className="h-3 w-3 text-green-400 mr-1" />
                        <span className="text-xs text-green-400 font-medium">
                          Encrypted
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => downloadFile(file._id, file.filename)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteFile(file._id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileList;
